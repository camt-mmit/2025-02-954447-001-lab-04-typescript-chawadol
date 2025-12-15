document.addEventListener("DOMContentLoaded", () => {
  const numberInputs = [...document.querySelectorAll<HTMLInputElement>("input.app-input-number")]; //[...] แปลให้เป็น array
  console.debug(numberInputs);

  numberInputs.forEach((elem) =>
    elem.addEventListener("change", () => {
      const result = numberInputs.reduce(
        (result, elem) =>
          result + (Number.isNaN(elem.valueAsNumber) ? 0 : elem.valueAsNumber),
        0,
      );

      const numberOutputs = [...document.querySelectorAll('.app-out-number')];
      numberOutputs.forEach(
        (elem) => (elem.textContent = result.toLocaleString()),
      );
      console.debug(numberOutputs);
    }),
  );
});
