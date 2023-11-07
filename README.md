# Kivy.org Website (https://www.kivy.org)

## Folder structure
- `configs` : contains the configurations needed to build the page templates via the **build** tool (during development and also distribution).
- `content` : This folder will be copied as-is to the website distribution (`dist`) during **build**. _Please make sure that everything included in this folder is expected to be publicly accessible via kivy.org._
- `templates` : All the HTML templates needed to build the Kivy website are here.
- `tools`: Contains `build.py`, which is needed in order to build the website.


## How do we generate the page from templates?

The **build tool** (`tools/build.py`) uses the `config/config.json` file in order to know which pages should be built and how to build them.

Multiple pages are defined in `config/config.json`, and each page has its own `template` and `env`.

### But in `templates/index.html`, there's an `[[ include "components/header.html" ]]`. What that does mean? And how we should use `env`?

The **build tool** uses [Renoir](https://github.com/emmett-framework/renoir) under the hood as a templating engine. Renoir is easy, production-ready and has quite complete [documentation](https://github.com/emmett-framework/renoir/blob/master/docs/quickstart.md).

`env` should contain all the variables that need to be accessed during the page generation.

As an example, with the following configuration:
```json
...
{
    "template": "index.html",
    "env": {
        "name": "Kivy"
    }
}
...
```
And the following snippet in `index.html`
```html
<p>Hi, [[ =name ]]</p>
```

Will produce the following output, when the template has been built:

```html
<p>Hello, Kivy</p>
```

## How about the styling (CSS)?

Writing CSS code from scratch can be boring and stressful, and sometimes it is a pain to maintain.

[TailwindCSS](https://github.com/tailwindlabs/tailwindcss) fills this gap, marking itself as a utility-first CSS framework for rapidly building custom user interfaces. It also comes with an extensive documentation and offers a lot of examples: [Getting Started with Tailwind CSS](https://tailwindcss.com/docs).

## Quick start:

### First-time setup
- Clone the `kivy-website` repository and move into the `kivy-website` folder
    ```bash
    git clone https://github.com/kivy/kivy-website.git
    cd kivy-website
    ```
-  Install `node` requirements (`tailwindcss`)
    ```bash
    npm install
    ```
- Install the required `python` deps to build the website templates. (a virtualenv is recommended)
    ```bash
    pip install -r requirements.txt
    ```

## Building the website (output is placed in the `dist` folder)

### Development mode

Both **tailwindcss** and the **build tool** come with auto-reload options in order to speed up site development.

```bash
npm run develop
```

```bash
python tools/build.py --watch
```

### Building for production

```bash
npm run build
```

```bash
python tools/build.py
```