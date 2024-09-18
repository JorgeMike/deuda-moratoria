import React from "react";
import data from "@/app/data/cpp.json";

export const getDate = (dateString: string) => {
  const date = new Date(dateString);

  // Obtener el día
  const day = date.getDate();

  // Crear un array de meses
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Obtener el mes en formato texto
  const month = months[date.getMonth()];

  // Obtener el año
  const year = date.getFullYear();

  // Retornar la fecha formateada
  return `${day} de ${month} del ${year}`;
};

export default function page() {
  return (
    <div className="flex-grow-1 d-flex flex-column align-items-center">
      <div className="container my-4">
        <h1 className="text-center">
          Costo de captación a plazo de pasivos en Udis (CCP-Udis), Tasa en por
          ciento anual
        </h1>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Fecha</th>
              <th scope="col">CPP-UDIs</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{getDate(item.Fecha)}</td>
                <td>{item["CCP-Udis"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
