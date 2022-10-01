appendToList = (li, nombre, elemento) => {
  const li2 = document.createElement("li");
  li2.innerHTML = "<b>" + nombre + "</b>: " + elemento;
  li.appendChild(li2);
};
appendData = () => {
  console.log(list);
  const listElem = document.getElementById("list");
  const ul = document.createElement("ul");
  for (let i in list) {
    if (list[i].Nombre) {
      //If element not empty
      const li = document.createElement("li");
      li.innerHTML = "<b>" + "Nombre</b>: " + list[i].Nombre;

      //Inner List
      const ul2 = document.createElement("ul");
      appendToList(ul2, "Descripción", list[i].Descripcion);
      appendToList(ul2, "Tipo", list[i].Tipo);
      appendToList(ul2, "Empleados", list[i].Empleados);
      appendToList(ul2, "Cede", list[i].Cede);
      appendToList(ul2, "Locales", list[i].Locales);
      appendToList(ul2, "Rubros", list[i].Rubros);
      appendToList(ul2, "Certificaciones", list[i].Certificaciones);

      //Append lists
      li.appendChild(ul2);
      ul.appendChild(li);
    }
  }
  listElem.appendChild(ul);
};

appendData();
