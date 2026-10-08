import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Field } from '@base-ui/react/field';
import { CaretDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { IconSlot } from '../../internal/IconSlot';
import { toneIcons } from '../../internal/toneIcons';
import { useInheritedTheme } from '../../internal/useInheritedTheme';
import { Spinner } from '../Spinner';
import styles from './ComboBox.module.scss';

export interface ComboBoxOption {
  /**
   * Identifies the option: the combobox's value is the value of the chosen option (or the values
   * of the chosen options, with `multiple`).
   */
  value: string;
  /**
   * The label of the option: the text matched while typing, and shown in the field once chosen.
   */
  label: string;
  /**
   * Whether this option cannot be chosen.
   * @default false
   */
  disabled?: boolean;
}

export interface ComboBoxGroup {
  /**
   * Title of the group, shown above its options and read by screen readers as the group's name.
   */
  label: string;
  /**
   * The options of the group.
   */
  options: readonly ComboBoxOption[];
}

type ChangeEventDetails = BaseCombobox.Root.ChangeEventDetails;

interface ComboBoxBaseProps {
  /**
   * Visible label, linked to the field. Required: every combobox needs an accessible name.
   */
  label: ReactNode;
  /**
   * Hides the label visually. It stays in the page for screen readers. Only for comboboxes whose
   * purpose is obvious from context. A visible label is better in forms.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * The options, as an array: `[{ value: 'fr', label: 'France' }]`. To group them under titles,
   * pass groups instead: `[{ label: 'Europe', options: [...] }]`.
   *
   * With `loadOptions`, the options shown before a search, and the labels of the values the field
   * starts with (those saved by the app): pass them here so their chips have a label.
   */
  options?: readonly ComboBoxOption[] | readonly ComboBoxGroup[];
  /**
   * Loads the options from an API, for lists too long to send to the page: called with what was
   * typed, it returns the matching options. They are shown as they are, without filtering. The
   * combobox waits for a pause in typing (`debounce`), cancels a search when a new one starts (pass
   * `signal` to `fetch`), shows that it is searching, and says when the search failed.
   *
   * ```tsx
   * loadOptions={async (query, { signal }) => {
   *   const response = await fetch(`/api/users?q=${query}`, { signal });
   *   const users = await response.json();
   *   return users.map((user) => ({ value: user.id, label: user.name }));
   * }}
   * ```
   */
  loadOptions?: (
    query: string,
    context: { signal: AbortSignal },
  ) => Promise<readonly ComboBoxOption[]>;
  /**
   * With `loadOptions`, how long to wait after the last key press before searching, in
   * milliseconds.
   * @default 250
   */
  debounce?: number;
  /**
   * With `loadOptions`, how many characters must be typed before searching. At 0, the options are
   * loaded as soon as the list opens.
   * @default 1
   */
  minQueryLength?: number;
  /**
   * Shown in the field while it is empty, such as "Search a country". With `multiple`, it is
   * shown until a first option is chosen.
   */
  placeholder?: string;
  /**
   * Shown in the list when no option matches what was typed.
   * @default 'No matches'
   */
  emptyText?: string;
  /**
   * With `loadOptions`, shown in the list before a search, while there are no options to show.
   * @default 'Type to search'
   */
  promptText?: string;
  /**
   * With `loadOptions`, shown in the list while searching.
   * @default 'Searching…'
   */
  loadingText?: string;
  /**
   * With `loadOptions`, shown in the list when a search failed.
   * @default "Couldn't load results"
   */
  errorText?: string;
  /**
   * With `multiple`, the start of the accessible name of each chip's remove button, followed by
   * the option's label: "Remove France".
   * @default 'Remove'
   */
  removeLabel?: string;
  /**
   * Whether the list is open, when controlled. Update it from `onOpenChange`.
   */
  open?: boolean;
  /**
   * Whether the list is initially open, when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Called when the list opens or closes, in both controlled and uncontrolled use.
   */
  onOpenChange?: (open: boolean, eventDetails: ChangeEventDetails) => void;
  /**
   * Text below the field: a hint, or the error message when `error` is set. Linked to the field
   * with `aria-describedby`, so screen readers announce it.
   */
  helperText?: ReactNode;
  /**
   * Whether the choice is invalid. Paints the field, label and `helperText` red and sets
   * `aria-invalid`. Explain the error in `helperText`: color alone is not enough.
   * @default false
   */
  error?: boolean;
  /**
   * Icon at the start of the field, such as `<GlobeIcon />` from `@phosphor-icons/react`.
   * Decorative (hidden from screen readers).
   */
  startIcon?: ReactElement;
  /**
   * Whether the combobox ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether an option must be chosen before submitting the form.
   * @default false
   */
  required?: boolean;
  /**
   * Name of the hidden input, to submit the chosen value (or values) with a form.
   */
  name?: string;
}

interface ComboBoxSingleProps extends ComboBoxBaseProps {
  /**
   * Whether several options can be chosen. Each chosen option is then a chip in the field, with
   * a button to remove it, and the value is an array.
   * @default false
   */
  multiple?: false;
  /**
   * The value of the chosen option, when controlled (`null` for none), or the values of the
   * chosen options with `multiple`. Update it from `onValueChange`.
   */
  value?: string | null;
  /**
   * The value of the initially chosen option, when uncontrolled, or the values of the initially
   * chosen options with `multiple`. Leave it out to start empty.
   */
  defaultValue?: string | null;
  /**
   * Called with the value of the chosen option when it changes (with `multiple`, the values of
   * the chosen options), in both controlled and uncontrolled use.
   */
  onValueChange?: (value: string | null, eventDetails: ChangeEventDetails) => void;
}

interface ComboBoxMultipleProps extends ComboBoxBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails: ChangeEventDetails) => void;
}

// One value or several: `multiple` sets the type of the value
export type ComboBoxProps = ComboBoxSingleProps | ComboBoxMultipleProps;

type Options = NonNullable<ComboBoxBaseProps['options']>;

const noOptions: readonly ComboBoxOption[] = [];

function isGroup(entry: ComboBoxOption | ComboBoxGroup): entry is ComboBoxGroup {
  return 'options' in entry;
}

type SearchStatus = 'idle' | 'loading' | 'error';

// Searches with loadOptions: waits for a pause in typing, aborts the previous search, and remembers
// the label of every option it received, so a chosen option keeps its label in the field once
// other results replace it. `results` is null before a search (or below minQueryLength): the list
// then shows the `options` prop. While searching, the list keeps the previous results, or shows
// none: never the `options`, which do not match what was typed. A failed search shows none.
function useSearch(
  loadOptions: ComboBoxBaseProps['loadOptions'],
  debounce: number,
  minQueryLength: number,
) {
  const [results, setResults] = useState<readonly ComboBoxOption[] | null>(null);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [knownLabels, setKnownLabels] = useState<ReadonlyMap<string, string>>(new Map());
  const pending = useRef<{ timer: number; controller: AbortController } | null>(null);

  const cancel = useCallback(() => {
    if (pending.current) {
      window.clearTimeout(pending.current.timer);
      pending.current.controller.abort();
      pending.current = null;
    }
  }, []);

  // A search still running when the combobox goes away is aborted
  useEffect(() => cancel, [cancel]);

  const search = (query: string) => {
    if (!loadOptions) {
      return;
    }
    cancel();
    if (query.length < minQueryLength) {
      setResults(null);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    setResults((previous) => previous ?? []);
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      loadOptions(query, { signal: controller.signal }).then(
        (options) => {
          if (controller.signal.aborted) {
            return;
          }
          setResults(options);
          setStatus('idle');
          setKnownLabels(
            (known) => new Map([...known, ...options.map((o) => [o.value, o.label] as const)]),
          );
        },
        () => {
          if (!controller.signal.aborted) {
            setResults([]);
            setStatus('error');
          }
        },
      );
    }, debounce);
    pending.current = { timer, controller };
  };

  return { results, status, knownLabels, search };
}

// The options as Base UI's collection: it filters them and identifies them by `value`. Base UI
// marks a group by an `items` array, so the kit's groups are mapped onto that shape.
function useOptions(options: Options) {
  return useMemo(() => {
    const groups = options.some(isGroup)
      ? (options as readonly ComboBoxGroup[]).map((group) => ({
          label: group.label,
          items: group.options,
        }))
      : undefined;

    return {
      groups,
      items: BaseCombobox.createItems<ComboBoxOption, string>(
        groups ?? (options as readonly ComboBoxOption[]),
        {
          getValue: (option) => option.value,
          getLabel: (option) => option.label,
        },
      ),
    };
  }, [options]);
}

function labelsOf(options: Options) {
  return options
    .flatMap((entry) => (isGroup(entry) ? entry.options : [entry]))
    .map((option) => [option.value, option.label] as const);
}

// Animates the field's height as chips wrap onto a new line or leave one. CSS cannot transition a
// height that follows the content, so the chips' height is measured and set on the field, which
// transitions its own. Transitions start after the first measure: the field opens at its height.
function useChipsHeight(fieldRef: RefObject<HTMLDivElement | null>) {
  const [animated, setAnimated] = useState(false);

  const chipsRef = useCallback(
    (chips: HTMLDivElement | null) => {
      if (!chips || typeof ResizeObserver === 'undefined') {
        return undefined;
      }
      let frame = 0;
      const observer = new ResizeObserver(([entry]) => {
        const height = entry.borderBoxSize[0].blockSize;
        fieldRef.current?.style.setProperty('--chips-block-size', `${height}px`);
        frame ||= requestAnimationFrame(() => setAnimated(true));
      });
      observer.observe(chips);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
      };
    },
    [fieldRef],
  );

  return { chipsRef, animated };
}

/**
 * A choice among a long list that you can type into to filter it, such as a country or tags. The
 * field is carved like an Input (a value goes here), with a round accent button at its end that
 * opens the list; the list floats above the page. Keyboard: typing filters, arrows move, Enter
 * chooses, Escape closes.
 *
 * With `multiple`, each chosen option is a chip in the field, and the field grows onto several
 * lines as chips are added. The list stays open after a choice, with what was typed, to choose
 * several in a row. A
 * chip is removed with its button, or with Backspace from the start of the field; Left Arrow
 * moves from the field to the chips.
 *
 * Options go as an array with `options`, grouped under titles if needed. For a list too long to
 * send to the page, `loadOptions` loads them from an API as you type.
 *
 * For 2 to 5 short options, use `Segmented`; for a few choices shown at once, `Chip.Group`.
 *
 * Works uncontrolled or controlled:
 * - **Uncontrolled**: `<ComboBox label="Country" options={countries} defaultValue="fr" />`.
 * - **Controlled**: `<ComboBox label="Country" options={countries} value={country}
 *   onValueChange={setCountry} />`.
 */
export function ComboBox({
  label,
  hideLabel = false,
  options = noOptions,
  loadOptions,
  debounce = 250,
  minQueryLength = 1,
  placeholder,
  emptyText = 'No matches',
  promptText = 'Type to search',
  loadingText = 'Searching…',
  errorText = "Couldn't load results",
  removeLabel = 'Remove',
  helperText,
  error = false,
  startIcon,
  disabled = false,
  onOpenChange,
  ...rootProps
}: ComboBoxProps) {
  const { anchorRef, positionerRef } = useInheritedTheme<HTMLDivElement>();
  const { results, status, knownLabels, search } = useSearch(loadOptions, debounce, minQueryLength);
  const { groups, items } = useOptions(results ?? options);
  // Labels of every option seen so far: a chosen one may not be among the current results
  const labels = useMemo(
    () => new Map([...knownLabels, ...labelsOf(options)]),
    [knownLabels, options],
  );
  const multiple = rootProps.multiple === true;
  const { chipsRef, animated } = useChipsHeight(anchorRef);

  // With several values to choose, the list stays open after a choice
  const handleOpenChange = (open: boolean, eventDetails: ChangeEventDetails) => {
    if (multiple && !open && eventDetails.reason === 'item-press') {
      eventDetails.cancel();
      return;
    }
    // Without a minimum length, the options load as soon as the list opens
    if (open && minQueryLength === 0 && results === null && status === 'idle') {
      search('');
    }
    onOpenChange?.(open, eventDetails);
  };

  // Searches what is typed, and goes back to the options when the field is emptied (with
  // `multiple`, a choice empties it). Not the label a choice writes into the field.
  const handleInputValueChange = (query: string, eventDetails: ChangeEventDetails) => {
    if (eventDetails.reason === 'input-change' || query === '') {
      search(query);
    }
  };

  const renderOption = (option: ComboBoxOption) => (
    <BaseCombobox.Item
      key={option.value}
      value={option.value}
      disabled={option.disabled}
      className={styles.item}
      style={undefined}
    >
      <span className={styles.itemText}>{option.label}</span>
      <BaseCombobox.ItemIndicator className={styles.itemIndicator}>
        <IconSlot icon={<CheckIcon />} className={styles.icon} />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );

  const input = (hasValue: boolean) => (
    <BaseCombobox.Input
      className={styles.input}
      placeholder={hasValue ? undefined : placeholder}
      style={undefined}
    />
  );

  return (
    // Field.Root spreads the invalid and disabled states to the label, input and description
    <Field.Root disabled={disabled} invalid={error} className={styles.field}>
      <Field.Label className={styles.label} data-hidden={hideLabel ? '' : undefined}>
        {label}
      </Field.Label>
      {/* The union of value types is checked by ComboBoxProps; Base UI takes either shape */}
      <BaseCombobox.Root<string, boolean | undefined, ComboBoxOption>
        {...(rootProps as BaseCombobox.Root.Props<string, boolean | undefined, ComboBoxOption>)}
        items={items}
        // The label of a chosen option that the current results no longer hold
        itemToStringLabel={(value: string) => labels.get(value) ?? value}
        // Loaded options are already the matches: the API filtered them
        filter={loadOptions ? null : undefined}
        disabled={disabled}
        onOpenChange={handleOpenChange}
        onInputValueChange={loadOptions ? handleInputValueChange : undefined}
      >
        <BaseCombobox.InputGroup
          ref={anchorRef}
          className={[styles.control, multiple && styles.multiple, animated && styles.animated]
            .filter(Boolean)
            .join(' ')}
          style={undefined}
        >
          <IconSlot icon={startIcon} className={styles.startIcon} />
          {multiple ? (
            <BaseCombobox.Chips ref={chipsRef} className={styles.chips}>
              <BaseCombobox.Value>
                {(value: readonly string[]) => (
                  <>
                    {value.map((chosen) => {
                      const chipLabel = labels.get(chosen) ?? chosen;
                      return (
                        <BaseCombobox.Chip key={chosen} className={styles.chip} style={undefined}>
                          <span className={styles.chipLabel}>{chipLabel}</span>
                          <BaseCombobox.ChipRemove
                            className={styles.chipRemove}
                            aria-label={`${removeLabel} ${chipLabel}`}
                            style={undefined}
                          >
                            <IconSlot icon={<XIcon />} className={styles.chipRemoveIcon} />
                          </BaseCombobox.ChipRemove>
                        </BaseCombobox.Chip>
                      );
                    })}
                    {input(value.length > 0)}
                  </>
                )}
              </BaseCombobox.Value>
            </BaseCombobox.Chips>
          ) : (
            input(false)
          )}
          <BaseCombobox.Trigger className={styles.trigger} style={undefined}>
            <IconSlot icon={<CaretDownIcon />} className={styles.triggerIcon} />
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner ref={positionerRef} className={styles.positioner} sideOffset={4}>
            <BaseCombobox.Popup className={styles.popup}>
              {/* Announced to screen readers: it stays mounted while its content changes */}
              {loadOptions && (
                <BaseCombobox.Status>
                  {status === 'loading' && (
                    <div className={styles.status}>
                      <IconSlot icon={<Spinner />} className={styles.icon} />
                      {loadingText}
                    </div>
                  )}
                  {status === 'error' && (
                    <div className={`${styles.status} ${styles.error}`}>
                      <IconSlot icon={toneIcons.danger} className={styles.icon} />
                      {errorText}
                    </div>
                  )}
                </BaseCombobox.Status>
              )}
              <BaseCombobox.Empty>
                {status === 'idle' && (
                  <div className={styles.empty}>
                    {results === null && loadOptions ? promptText : emptyText}
                  </div>
                )}
              </BaseCombobox.Empty>
              <BaseCombobox.List className={styles.list}>
                {groups
                  ? (group: { label: string; items: readonly ComboBoxOption[] }) => (
                      <BaseCombobox.Group
                        key={group.label}
                        items={group.items as ComboBoxOption[]}
                        className={styles.group}
                      >
                        <BaseCombobox.GroupLabel className={styles.groupLabel}>
                          {group.label}
                        </BaseCombobox.GroupLabel>
                        <BaseCombobox.Collection>{renderOption}</BaseCombobox.Collection>
                      </BaseCombobox.Group>
                    )
                  : renderOption}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
      {helperText != null && (
        <Field.Description className={styles.helperText}>{helperText}</Field.Description>
      )}
    </Field.Root>
  );
}
