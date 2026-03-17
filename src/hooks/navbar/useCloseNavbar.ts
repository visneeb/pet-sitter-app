export function closeNavbar() {
  const drawerToggle = document.getElementById(
    "my-drawer-1",
  ) as HTMLInputElement;
  if (drawerToggle) {
    drawerToggle.checked = false;
    const drawerSide = document.querySelector(".drawer-side") as HTMLElement;
    if (drawerSide) drawerSide.style.visibility = "hidden";
  }
  (document.activeElement as HTMLElement)?.blur();
}
