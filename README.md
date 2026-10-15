# Domain Sort

<img align="left" src="images/icon.png" hspace="30">

A tiny VSCodium / VS Code extension with two practical commands for
people who work with lists of domains:

1. **Sort lines by top-level domain** (ascending or descending),
   grouping first by TLD, then by second-level domain, then by
   subdomain.
2. **Extract the `host` field** from lines of JSON (e.g. output from
   [subfinder](https://github.com/projectdiscovery/subfinder) with
   `-json`).

<br clear="left"/>

## Features

### Sort Ascending / Descending

Select any block of text, run the command, and the lines are sorted by
domain hierarchy — first by TLD, then by the registrable domain, then by
subdomain.

**Example — ascending:**

Input:
```
www.google.com
mail.google.com
example.org
it.wikipedia.org
foo.co.uk
bar.com
```

Output:
```
bar.com
mail.google.com
www.google.com
example.org
it.wikipedia.org
foo.co.uk
```

This is different from a plain alphabetical sort. A plain sort would put
`bar.com` before `example.org` before `foo.co.uk` before `it.wikipedia.org`
before `mail.google.com` — mixing all TLDs together. Domain Sort groups
them by hierarchy instead.

### Extract Host Field

Given a selection of JSON lines (one JSON object per line), keep only the
value of the `host` field. Non-JSON lines (e.g. log lines, banners) are
left unchanged, so you can safely run it on a mixed file.

**Example:**

Input:
```
[INF] Loading provider config ...
{"host":"www.example.co.uk","ip":"104.21.2.18","input":"example.co.uk","source":"thc"}
{"host":"mail.example.co.uk","ip":"104.21.2.18","input":"example.co.uk","source":"thc"}
[INF] Found 2 subdomains ...
```

Output:
```
[INF] Loading provider config ...
www.example.co.uk
mail.example.co.uk
[INF] Found 2 subdomains ...
```

## Usage

1. Open a file containing a list of domains (one per line) or JSON lines.
2. Select the lines you want to process.
3. Open the Command Palette (`Ctrl+Shift+P`).
4. Search for one of:
   - `Domain Sort: Sort Ascending`
   - `Domain Sort: Sort Descending`
   - `Domain Sort: Extract Host Field`

## Typical workflow with subfinder

```bash
subfinder -json -no-color -all -ip -active -d example.com > subs.json
```

Open `subs.json` in VSCodium, select all (`Ctrl+A`), then:

1. Run **Domain Sort: Extract Host Field** → you get a clean list of hosts.
2. Run **Domain Sort: Sort Ascending** → the list is sorted by hierarchy.

## Installation

### From the marketplace (VSCodium)

Search for **Domain Sort** in the Extensions view.

### From source

```bash
git clone https://github.com/F0xh0le/Domain-sort.git
cd Domain-sort
npm install
npm run compile
```

Then press `F5` in VSCodium / VS Code to launch the Extension
Development Host and test it.

### From a .vsix package

```bash
codium --install-extension domain-sort-0.0.1.vsix
```

## Requirements

- VSCodium or VS Code `1.135.0` or newer.

## Release Notes

### 0.0.1

Initial release:
- Sort lines by domain hierarchy (ascending / descending)
- Extract `host` field from JSON lines