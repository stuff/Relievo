# Security policy

## Supported versions

Relievo is at an early stage (0.x). Only the latest release receives fixes.

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately instead, in one of two ways:

- On GitHub: open the repository's **Security** tab and choose **Report a vulnerability**.
- By email: nchalleil@gmail.com, with "Relievo security" in the subject.

Describe what you found, the version affected and, if you can, how to reproduce it. You will get an answer within a few days. Once the problem is confirmed, a fix is released and the report is credited, unless you prefer to stay anonymous.

## Scope

Relievo is a front-end component library with no server side. Reports about the code it ships are in scope: for example a component that renders untrusted input as HTML, or `ThemeScript`, the inline script that apps place in `<head>`. Vulnerabilities in a dependency (Base UI, React, Phosphor) belong to that project, though a heads-up here is welcome when Relievo is affected.
