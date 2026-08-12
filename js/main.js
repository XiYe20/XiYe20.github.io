const emailButton = document.querySelector(".profile-email");

if (emailButton) {
  const emailAddress = emailButton.dataset.email;
  const tooltip = emailButton.querySelector(".profile-email-tooltip");
  const defaultMessage = tooltip.textContent;
  let resetTimer;

  const copyWithFallback = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall through to the compatibility method below.
      }
    }

    const temporaryField = document.createElement("textarea");
    temporaryField.value = text;
    temporaryField.setAttribute("readonly", "");
    temporaryField.style.position = "fixed";
    temporaryField.style.opacity = "0";
    document.body.appendChild(temporaryField);
    temporaryField.select();
    const copied = document.execCommand("copy");
    temporaryField.remove();

    if (!copied) {
      throw new Error("Unable to copy email address");
    }
  };

  emailButton.addEventListener("click", async () => {
    window.clearTimeout(resetTimer);

    try {
      await copyWithFallback(emailAddress);
      tooltip.textContent = "Email address has been copied!";
      emailButton.classList.add("is-copied");

      resetTimer = window.setTimeout(() => {
        tooltip.textContent = defaultMessage;
        emailButton.classList.remove("is-copied");
      }, 2200);
    } catch {
      tooltip.textContent = `Please copy: ${emailAddress}`;
      emailButton.classList.add("is-copied");
    }
  });
}
