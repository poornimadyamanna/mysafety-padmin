export function removeGoogleTranslateBanner(): void {
  const hide = () => {
    document
      .querySelectorAll("iframe.goog-te-banner-frame")
      .forEach((iframe) => {
        const el = iframe as HTMLIFrameElement;
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.height = "0";
        el.style.width = "0";
      });
    document
      .querySelectorAll(
        ".goog-te-banner-frame, .skiptranslate, .VIpgJd-ZVi9od-ORHb",
      )
      .forEach((el) => {
        (el as HTMLElement).style.display = "none";
        (el as HTMLElement).style.visibility = "hidden";
      });
    document.documentElement.style.top = "0px";
    document.body.style.top = "0px";
    document.body.style.marginTop = "0px";
    document.body.style.paddingTop = "0px";
  };
  hide();
  const observer = new MutationObserver(() => {
    hide();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  setInterval(hide, 500);
}
