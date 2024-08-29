import type { Directive } from "vue"

const errorNotify: Directive = {
  updated(el: HTMLElement, binding) {
    const notf = el.querySelector('#notifiers');
    if (notf) {
      el.removeChild(notf);
    }

    if (binding.value) {
      const notifier = document.createElement('div');
      notifier.style.position = 'absolute';
      notifier.style.top = '100%';
      notifier.style.color = '#d03050';
      notifier.textContent = binding.value;
      notifier.id = 'notifiers'
      el.appendChild(notifier)
    }
  },
}

export default errorNotify;