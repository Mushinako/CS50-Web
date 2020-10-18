"""
Markdown rules

Note these rules may be more permissive than the rules defined at
  https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/basic-writing-and-formatting-syntax
"""

import re

#######################################
# Headings
#######################################
r"""
^                   Start of the line
    (?P<n>          (Capturing group `n`) Indicates the level of heading
        #+          Heading indicators `#`
    )
    [ \t]           There must be a space or tab in between
    (?P<t>          (Capturing group `t`) The text
        .+          Heading text
    )
$                   End of line
"""
heading_regex = re.compile(r"^(?P<n>#+)[ \t](?P<t>.+)$")

#######################################
# Styling text
#######################################

# Italic
r"""
(?:                 (Non-capturing group) Checks if the start is valid
    ^               The pattern must start from the start of the line
    |(?<=             or (lookbehind)
        \\\*          the character before is an escaped `*`
    )
    |(?<!             or (negative lookbehind)
        [\\*]         the character before is not `\` or unescaped `*`
    )
)
\*                  Start of italic
(?P<t>              (Capturing group `t`) The text
    (?!             (Negative lookahead)
        [\s*]       Check if the text does not start with a whitespace
                        character or unescaped `*`
    )
    .+?             Actual text; match non-greedily
    (?<!            (Negative lookbehind)
        [\s\\]      The text cannot end on a whitespace or `\`
    )
)
\*                  End of italic
"""
italic_regex_star = re.compile(
    r"(?:^|(?<=\\\*)|(?<![\\*]))\*(?P<t>(?![\s*]).+?(?<![\s\\]))\*")

r"""
(?:                 (Non-capturing group) Checks if the start is valid
    ^               The pattern must start from the start of the line
    |(?<=             or (lookbehind)
        \\_           the character before is an escaped `_`
    )
    |(?<!             or (negative lookbehind)
        [\\_]         the character before is not `\` or unescaped `_`
    )
)
_                   Start of italic
(?P<t>              (Capturing group `t`) The text
    (?!             (Negative lookahead)
        [\s_]       Check if the text does not start with a whitespace
                        character or unescaped `_`
    )
    .+?             Actual text; match non-greedily
    (?<!            (Negative lookbehind)
        [\s\\]      The text cannot end on a whitespace or `\`
    )
)
_                   End of italic
"""
italic_regex_underscore = re.compile(
    r"(?:^|(?<=\\_)|(?<![\\_]))_(?P<t>(?![\s_]).+?(?<![\s\\]))_")

# Bold
r"""
(?:                 (Non-capturing group) Checks if the start is valid
    ^               The pattern must start from the start of the line
    |(?<=             or (lookbehind)
        \\\*          the character before is an escaped `*`
    )
    |(?<!             or (negative lookbehind)
        [\\*]         the character before is not `\` or unescaped `*`
    )
)
\*{2}               Start of bold
(?P<t>              (Capturing group `t`) The text
    (?!             (Negative lookahead)
        [\s*]       Check if the text does not start with a whitespace
                        character or unescaped `*`
    )
    .+?             Actual text; match non-greedily
    (?<!            (Negative lookbehind)
        [\s\\]      The text cannot end on a whitespace or `\`
    )
)
\*{2}               End of bold
"""
bold_regex_star = re.compile(
    r"(?:^|(?<=\\\*)|(?<![\\*]))\*{2}(?P<t>(?![\s*]).+?(?<![\s\\]))\*{2}")

r"""
(?:                 (Non-capturing group) Checks if the start is valid
    ^               The pattern must start from the start of the line
    |(?<=             or (lookbehind)
        \\_           the character before is an escaped `_`
    )
    |(?<!             or (negative lookbehind)
        [\\_]         the character before is not `\` or unescaped `_`
    )
)
_{2}                Start of bold
(?P<t>              (Capturing group `t`) The text
    (?!             (Negative lookahead)
        [\s_]       Check if the text does not start with a whitespace
                        character or unescaped `_`
    )
    .+?             Actual text; match non-greedily
    (?<!            (Negative lookbehind)
        [\s\\]      The text cannot end on a whitespace or `\`
    )
)
_{2}                End of bold
"""
bold_regex_underscore = re.compile(
    r"(?:^|(?<=\\_)|(?<![\\_]))_{2}(?P<t>(?![\s_]).+?(?<![\s\\]))_{2}")

# Bold and italic
r"""
\*{3}               Start of bold and italic
(?P<t>              (Capturing group `t`) The text
    (?!             (Negative lookahead)
        [\s*]       Check if the text does not start with a whitespace
                        character or unescaped `*`
    )
    .+?             Actual text; match non-greedily
    (?<!            (Negative lookbehind)
        [\s\\]      The text cannot end on a whitespace or `\`
    )
)
\*{3}               End of bold and italic
"""
bold_italic = re.compile(r"\*{3}(?P<t>(?![\s*]).+?(?<![\s\\]))\*{3}")

# Strikethrough
r"""
~{2}                Start of strikethrough
(?P<t>              (Capturing group `t`) The text
    (?!             (Negative lookahead)
        [\s~]       Check if the text does not start with a whitespace
                        character or unescaped `~`
    )
    .+?             Actual text; match non-greedily
    (?<!            (Negative lookbehind)
        [\s\\]      The text cannot end on a whitespace or `\`
    )
)
~{2}                End of strikethrough
"""
strikethrough = re.compile(r"~{2}(?P<t>(?![\s~]).+?(?<![\s\\]))~{2}")

#######################################
# Lists
#######################################
