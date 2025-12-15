/**
 * Create input-list component.
 *
 * @param {HTMLElement} componentElem
 *
 * @returns {HTMLElement}
 */
export function createComponent(componentElem: HTMLElement): HTMLElement {
  const sectionTemplate =
    componentElem.querySelector<HTMLTemplateElement>('.app-tmp-section');
  const mainContainer = componentElem.querySelector<HTMLElement>(
    '.app-cmp-main-container'
  );

  if (!sectionTemplate) {
    throw new Error('Template .app-tmp-section is not found');
  }
  if (!mainContainer) {
    throw new Error('Main container .app-cmp-main-container is not found');
  }

  // ------------------------------
  // Regenerate Section Titles
  // ------------------------------
  const regenerateSectionTitlesAndStatus = () => {
    const sections =
      mainContainer.querySelectorAll<HTMLElement>('.app-cmp-section');

    sections.forEach((section, index) => {
      const title = section.querySelector<HTMLElement>('.app-title-section');
      if (title) title.textContent = `Section ${index + 1}`;

      const removeBtn = section.querySelector<HTMLButtonElement>(
        '.app-cmd-remove-section'
      );
      if (removeBtn) {
        removeBtn.disabled = sections.length === 1;
      }
    });
  };

  // ------------------------------
  // Create Each Section Component
  // ------------------------------
  const createSectionComponent = () => {
    const fragment = sectionTemplate.content.cloneNode(
      true
    ) as DocumentFragment;
    const sectionContainer = fragment.firstElementChild as HTMLElement;

    const numberTemplate = sectionContainer.querySelector<HTMLTemplateElement>(
      '.app-tmp-number-component'
    );
    const inputListContainer = sectionContainer.querySelector<HTMLElement>(
      '.app-cmp-number-list'
    );

    if (!numberTemplate || !inputListContainer) {
      throw new Error('Inner template or container not found inside section');
    }

    // ------------------------------
    // Update number item titles
    // ------------------------------
    const regenerateNumberTitlesAndStatus = () => {
      const inputItems = Array.from(
        inputListContainer.querySelectorAll<HTMLElement>('.app-cmp-number')
      );

      inputItems.forEach((inputContainer, index) => {
        const title =
          inputContainer.querySelector<HTMLElement>('.app-title-number');
        if (title) title.textContent = `${index + 1}`;

        const removeBtn = inputContainer.querySelector<HTMLButtonElement>(
          '.app-cmd-remove-number-input'
        );
        if (removeBtn) {
          removeBtn.disabled = inputItems.length === 1;
        }
      });
    };

    // ------------------------------
    // Recalculate sum for section
    // ------------------------------
    const recalculateResult = () => {
      const result = Array.from(
        inputListContainer.querySelectorAll<HTMLInputElement>('.app-inp-number')
      ).reduce((sum, elem) => {
        return (
          sum + (Number.isNaN(elem.valueAsNumber) ? 0 : elem.valueAsNumber)
        );
      }, 0);

      sectionContainer
        .querySelectorAll<HTMLElement>('.app-out-number')
        .forEach((elem) => (elem.textContent = result.toLocaleString()));
    };

    // ------------------------------
    // Create Input Component
    // ------------------------------
    const createInputComponent = () => {
      const frag = numberTemplate.content.cloneNode(true) as DocumentFragment;
      const inputContainer = frag.firstElementChild as HTMLElement;

      inputContainer.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement;

        if (target?.matches('.app-cmd-remove-number-input')) {
          inputContainer.remove();
          regenerateNumberTitlesAndStatus();
          recalculateResult();
        }
      });

      inputListContainer.append(inputContainer);
      regenerateNumberTitlesAndStatus();
      recalculateResult();
    };

    // ------------------------------
    // Input change event
    // ------------------------------
    inputListContainer.addEventListener('change', (ev) => {
      const target = ev.target as HTMLElement;
      if (target?.matches('.app-inp-number')) {
        recalculateResult();
      }
    });

    // ------------------------------
    // Section level click events
    // ------------------------------
    sectionContainer.addEventListener('click', (ev) => {
      const target = ev.target as HTMLElement;

      if (target?.matches('.app-cmd-add-number-input')) {
        createInputComponent();
      }

      if (target?.matches('.app-cmd-remove-section')) {
        sectionContainer.remove();
        regenerateSectionTitlesAndStatus();
      }
    });

    // Create initial number input
    createInputComponent();

    mainContainer.append(sectionContainer);
    regenerateSectionTitlesAndStatus();
  };

  // ------------------------------
  // Add section button
  // ------------------------------
  componentElem.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement;

    if (target?.matches('.app-cmd-add-section')) {
      createSectionComponent();
    }
  });

  // Create first section
  createSectionComponent();

  return componentElem;
}
