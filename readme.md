# Client-side nejen pro Thunbolt cms

Nainstalujeme přidáním závislosti do bower.json:

```
{
    "dependencies": {
        "thunbolt": ">=1.0"
    }
}
```

Zalinkujem buďto všechny moduly (soubor dist/thunbolt.min.js) nebo jen některé moduly (dist/modules/*)

## Form errors

Initializace:
```js
Thunbolt.FormErrors.init();
```

Validace při změně inputu
```js
Thunbolt.FormErrors.addListenerOnChange();
```

Kostra k vytvoření vlastního rendereru najdete v client/examples/form-errors/skeleton.js a potom stačí zaregistrovat a upravit init funkci:

```js
Thunbolt.FormErrors.addRenderer('custom', obj);
Thunbolt.FormErrors.init('custom');
```
