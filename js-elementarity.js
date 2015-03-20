/**
 * elements - бызовые элементы
 * relations - элементы от которых зависят базовые элементы
 */
(function( $ ) {
    // сюда складываем отношения в виде {element_id: [...relations...]}
    var elements = {};
    var options = {
        // data-elementarity: идентификатор элемента
        "id": 'elementarity'
        // data-relations: список элементов
        ,"relations": 'elementarity-relations'
        // data-elements: в элементах сюда записываем связи (может совпадать с id)
        ,"elements": 'elementarity'
        // класс для активных элементов
        ,"class": 'elementarity-selected'
        // кастомные обработчики
        ,"handlers" : {
            elements: [],
            relations: []
        }
    };
    // текущий выбранный элемент
    var current = null;
    // все элементы скриптов из DOM
    var nodes = null;

    var methods = {
        init: function (params) {
            $.extend(options, params);

            nodes = $('[data-'+options['elements']+']');

            return $(this).each(function (index, element) {
                var relations = [];
                var $elements = $(element).data(options['relations']);
                var $element = $(element);
                if ($elements.length > 0) {
                    var i;
                    var j;
                    var handler;

                    var items = $elements.split(',');

                    // находим все элементы, которые относятся к выбранному
                    nodes.each(function(index, element) {
                        var val;
                        var data = $(element).data(options['elements']).split(',');
                        for(i in items) {
                            val = $.trim(items[i]);
                            if (val && data.indexOf(val) > -1) {
                                relations.push($(this));

                                /**
                                 * проталкивание событий от relations к elements
                                 * теперь можно вызывать события на parents
                                 * и оно будет вызвано на базовом элементе
                                 */
                                for(j in options.handlers) {
                                    handler = options.handlers[j];
                                    $(this).on(handler.eventName, function() {
                                        var index = $(this).data(options['id']);
                                        elements[index] = relations;
                                        $element.trigger(
                                            handler.eventName,
                                            [
                                                $(this),
                                                elements[index]
                                            ]
                                        );
                                    });
                                    $element.on(handler.eventName, handler.eventCallback);
                                }
                            }
                        }
                    });

                    // запоминаем элементы
                    $(element).data(options['id'], index);
                    elements[index] = relations;
                    $(element).on('click', methods.select);
                }
            }.bind(this));
        },
        select: function (e) {
            e.preventDefault();
            // отменяем текущий выбор
            if (current) {
                var items = elements[methods.getElementId(current)];
                for(var i in items) {
                    items[i].removeClass(options['class']);
                }
                // повторно тыкнув просто снимаем выделение
                if (methods.getElementId(current) === methods.getElementId($(this))) {
                    current = null;
                    return;
                }
            }

            // устанавливаем новый выбранный элемент
            var items = elements[methods.getElementId($(this))];
            for(var i in items) {
                items[i].addClass(options['class']);
            }
            current = $(this);
        }
        ,getElementId: function(element) {
            return element.data(options['id']);
        }
    };

    /**
     * Привязываем к элементу другие элементы и при клике на этот элемент че-то делаем с привязанными
     * (пока просто "подсвечиваем")
     * @param method
     * @returns {*}
     */
    $.fn.elementarity = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует' );
        }

    };

})(jQuery);