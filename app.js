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
}



