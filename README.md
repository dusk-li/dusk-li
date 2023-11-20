# What is dusk.li?

Dusk.li is a website that rates websites based on their accessibility in terms of their support for **Dark Mode**.

Dark mode is defined by the [Bureau of Internet Accessibility](https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone) as follows:

> Dark modes and themes are extremely popular and they’re frequently touted as an accessibility solution. While the term "dark mode" can have different meanings for different developers, the basic idea is simple: Instead of displaying dark-colored text over a light background, a dark mode inverts the color scheme to display light-colored text over a dark background. This can create more contrast between the content and the background, limiting eyestrain and improving content readability.

As that page also states, Dark Mode is not a panacea - while it helps with several conditions, it can also hinder other conditions - especially if the dark mode color theme has a low contrast ratio.

A truly accessible site from a Brightness and Contrast perspective therefore must meet the following criteria:

1. Dark mode is supported
2. Dark mode will recognise the system setting for light or dark
3. Dark mode can be manually overriden
4. Site contrast is acceptable as assessed by https://color.a11y.com/Contrast/
5. Optionally, the site supports custom themes, ideally without having to create a login to do so.

The data behind it is maintained in the public repository https://github.com/dusk-li/dusk-li-data
