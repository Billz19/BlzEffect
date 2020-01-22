export default class Effects {
    /**
     * hide element with slide effect
     * @param {HTMLElement} element
     * @param {Number} duration
     */
    static slideUp(element, duration = 500) {
        return new Promise(resolve => {
            let propsArray = ['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-width'];
            element.style.height = element.offsetHeight + 'px';
            element.style.transitionProperty = 'height, padding, margin';
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight; //redraw
            element.style.overflow = 'hidden';
            propsArray.forEach(prop =>
                element.style[prop] = 0
            );
            window.setTimeout(function () {
                element.style.display = 'none';
                propsArray = ['transition-property', 'transition-duration', 'overflow', ...propsArray];
                propsArray.forEach(prop => element.style.removeProperty(prop));
                resolve(element);
            }, duration)
        });
    }

    /**
     * show element with slide effect
     * @param {HTMLElement} element
     * @param {Number} duration
     */
    static slideDown(element, duration = 500) {
        return new Promise(resolve => {
            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;
            if (display === 'none') display = 'block';
            element.style.display = display;
            let height = element.offsetHeight,
                propsArray = ['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-width'];
            element.style.overflow = 'hidden';
            propsArray.forEach(prop => element.style[prop] = 0);
            element.offsetHeight; // redraw
            element.style.transitionProperty = 'height, margin, padding';
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            propsArray.slice(1).forEach(prop => element.style.removeProperty(prop));
            propsArray = ['transition-property', 'transition-duration', 'overflow', ...propsArray];
            window.setTimeout(function () {
                propsArray.slice(0, 4).forEach(prop => element.style.removeProperty(prop));
                resolve(element);
            }, duration)
        });
    }

    /**
     * hide/show element with slide effect
     * @param {HTMLElement} element
     * @param {Number} duration
     */
    static slideToggle(element, duration = 500) {
        return new Promise(resolve => {
            const display = window.getComputedStyle(element).display;
            if (display === 'none')
                this.slideDown(element, duration).then(elem => resolve(elem));
            else
                this.slideUp(element, duration).then(elem => resolve(elem));
        });
    }

    /**
     * flip effect
     * @param {HTMLElement[]} elements
     * @param {Number} duration
     */
    static flip(elements, duration) {
        return new Flip(elements, duration)
    }
}


class Flip {
    /**
     * @param {HTMLElement[]} elements
     * @param {Number} duration
     */
    constructor(elements, duration = 500) {
        this.duration = duration;
        this.position = {};
        this.elements = elements;
        if (!this.elements[0].getAttribute('blz-idf')) {
            this.elements.forEach((elem, idx) => {
                elem.setAttribute('blz-idf', 'blz_' + (idx + 1));
            });
        }
    }

    /**
     * read elements position
     * @param {HTMLElement[]} elements
     */
    read(elements) {
        elements.forEach(elem => {
            const idf = elem.getAttribute('blz-idf');
            this.position[idf] = elem.getBoundingClientRect();
        });
    }

    /**
     * play with a flip effect
     * @param {HTMLElement[]} elements
     */
    play(elements) {
        elements.forEach(elem => {
            const idf = elem.getAttribute('blz-idf'),
                newPos = elem.getBoundingClientRect(),
                oldPos = this.position[idf];
            if (!oldPos) {
                elem.animate([
                    {
                        transform: `translate(0px,-30px)`,
                        opacity: 0
                    }, {
                        transform: 'none',
                        opacity: 1
                    }
                ], {
                    duration: this.duration,
                    fill: 'both',
                    easing: 'ease-in-out'
                });
                return;
            }
            let obj = {
                x: oldPos.x - newPos.x,
                y: oldPos.y - newPos.y,
                width: oldPos.width / newPos.width,
                height: oldPos.height / newPos.height
            };

            elem.animate([
                {
                    transform: `translate(${obj.x}px,${obj.y}px) scale(${obj.width},${obj.height})`
                }, {
                    transform: 'none'
                }
            ], {
                duration: this.duration,
                fill: 'both',
                easing: 'ease-in-out'
            });
        });
    }

    /**
     * remove elements with flip effect
     * @param {HTMLElement[]} elements
     */
    remove(elements) {
        elements.forEach(elem => elem.parentNode.appendChild(elem));
        // duplicate loop for better performance
        elements.forEach(elem => {
            const idf = elem.getAttribute('blz-idf'),
                newPos = elem.getBoundingClientRect(),
                oldPos = this.position[idf];
            let obj = {
                x: oldPos.x - newPos.x,
                y: oldPos.y - newPos.y
            };

            elem.animate([
                {
                    transform: `translate(${obj.x}px,${obj.y}px)`,
                    opacity: 1
                }, {
                    transform: `translate(${obj.x}px,${obj.y - 30}px)`,
                    opacity: 0
                }
            ], {
                duration: this.duration,
                fill: 'both',
                easing: 'ease-in-out'
            });

            setTimeout(() => {
                elem.parentNode.removeChild(elem);
            }, this.duration);
        });

    }

    /**
     * replace old elements by new ones with flip effect
     * @param {HTMLElement[]} oldElements
     * @param {HTMLElement[]} newElements
     */
    replace(oldElements, newElements) {
        const parent = oldElements[0].parentNode;
        let removedElems = [];
        this.read(oldElements);
        const idfs = newElements.map(el => {
            parent.appendChild(el);
            return el.getAttribute('blz-idf');
        });
        oldElements.forEach(el => {
            const idf = el.getAttribute('blz-idf');
            if (idfs.includes(idf)){
                parent.removeChild(el)
            } else removedElems.push(el);
        });
        this.remove(removedElems);
        this.play(newElements);
    }

}


