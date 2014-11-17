js-elementarity
===============

# Описание

Привязываем к элементу другие элементы.
При клике элемент выполняем определенные действия с привязанными элементами.

# Использование

## Разметка

```html
<div data-relations="element1, element2">Выделить элементы 1,2</div>
<div data-relations="element3">Выделить элементы 3</div>
<div data-relations="element1, element3">Выделить элементы 1,3</div>
...
<div data-elements="element1">Элемент1</div>
<div data-elements="element2">Элемент2</div>
<div data-elements="element3">Элемент3</div>
```

## Натягиваем плагин:

```javascript
$('#appointment-script li').elementarity({
	"id": 'node'
	,"relations": 'relations'
	,"elements": 'elements'
	,'class': 'selected'
});
```
