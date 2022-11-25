function render() {
  return `
    <header class="header">
    <div></div>
      <img src="./assets/images/{ doable }.png" alt="logo-double">
      <img src="./assets/icons/logout.svg" alt="">
    </header>
`;
}

const renderHeader = () => {
  return {
    toString() {
      return render();
    },
    addListeners() {},
  };
};
export { renderHeader };
