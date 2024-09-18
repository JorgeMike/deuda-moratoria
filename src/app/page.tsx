"use client";
import Link from "next/link";
import React from "react";
import { getDate } from "./serie/page";
import cpp from "./data/cpp.json";

export default function Home() {
  const [monto, setMonto] = React.useState<number>(2000000);
  const [fechaInicio, setFechaInicio] = React.useState<string>("2021-10-09 00:01:00");
  const [fechaFin, setFechaFin] = React.useState<string>("2024-08-28 00:01:00");
  const [udisInicio, setUdisInicio] = React.useState<number>(6.939794);
  const [udisFin, setUdisFin] = React.useState<number>(8.251818);
  const [respuesta, setRespuesta] = React.useState({
    paso1: 0,
    paso2: 0,
    paso3: 0,
  });

  function getCCPUdisByMonthYear(
    mes: number,
    anio: number
  ): number | undefined {
    // Formatear el mes con dos dígitos
    const mesString = mes.toString().padStart(2, "0");
    const fechaBuscar = `${anio}-${mesString}-01`;

    // Buscar la entrada en el archivo JSON que coincida con el año y mes
    const entry = cpp.find((item) => item.Fecha.startsWith(fechaBuscar));

    return entry ? entry["CCP-Udis"] : undefined;
  }

  const calculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Convertir a UDIS la suerte actual */
    const paso1 = monto / udisInicio;
    const paso2 = paso1 * udisFin;

    /* Definimos las fechas */
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    /* Calcular los meses transcurridos */
    const meses = calcularMesesTranscurridos(startDate, endDate);

    /* Inicializar variables  para la iteracion*/
    let currentMes = startDate.getMonth() + 1;// Enero es 0, por lo que sumamos 1
    let currentAnio = startDate.getFullYear();

    let suma = paso1; // Acumulador

    for (let i = 0; i < meses; i++) {
      const anioAnterior = currentAnio - 5;
      
      // Obtener los días del mes actual
      const diasDelMes = getDiasDelMes(currentMes, anioAnterior);

      // Obtener el valor de CCP-UDIS para el mes y año actual
      const ccpUdis = getCCPUdisByMonthYear(currentMes, anioAnterior);

      console.log(
        `Iteración ${
          i + 1
        }:\n Año ${anioAnterior}, Mes ${currentMes}, Días del mes: ${diasDelMes}, CCP-UDIS: ${ccpUdis}`
      );

      if (ccpUdis) {
        // Multiplicación por los días del mes y el valor de CCP-UDIS
        
        const multiplicacion = ((suma * ccpUdis * 0.0125) / 365) * diasDelMes;
        
        console.log(
          `Multiplicación: ((${suma} * ${ccpUdis} * 0.0125) / 365) * ${diasDelMes} = ${multiplicacion}`
        );

        suma += multiplicacion;

      } else {
        console.error(
          `No se encontró CCP-UDIS para ${currentAnio}-${currentMes}`
        );
      }

      // Incrementar el mes, y si llega a 12, reiniciar a 1 y aumentar el año
      if (currentMes === 12) {
        currentMes = 1;
        currentAnio += 1;
      } else {
        currentMes += 1;
      }
    }

    setRespuesta({
      paso1,
      paso2,
      paso3: suma, // Muestra el acumulado de las multiplicaciones
    });
  };

  // Función para obtener los días de un mes considerando los años bisiestos
  function getDiasDelMes(mes: number, anio: number): number {
    return new Date(anio, mes, 0).getDate();
  }

  function calcularMesesTranscurridos(
    fechaInicio: Date,
    fechaFin: Date
  ): number {
    const aniosDiferencia = fechaFin.getFullYear() - fechaInicio.getFullYear();
    const mesesDiferencia = fechaFin.getMonth() - fechaInicio.getMonth();

    return aniosDiferencia * 12 + mesesDiferencia;
  }

  return (
    <div className="flex-grow-1 d-flex flex-column align-items-center">
      <h1 className="my-5">Cálculo de deuda moratoria</h1>
      <form
        className="d-flex flex-column justify-content-center align-items-center border rounded px-2 py-4 gap-3"
        onSubmit={calculate}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-4">
              <label htmlFor="monto" className="form-label">
                Monto
              </label>
              <div className="input-group">
                <div className="input-group-text">@</div>
                <input
                  type="text"
                  id="monto"
                  className="form-control"
                  placeholder="Ej. 2000000"
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="init" className="form-label">
                Fecha de inicio
              </label>
              <input
                type="date"
                id="init"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="end" className="form-label">
                Fecha de fin
              </label>
              <input
                type="date"
                id="end"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 col-md-6">
              <label htmlFor="udisInit" className="form-label">
                UDIs a la fecha de inicio
              </label>
              <input
                type="text"
                id="udisInit"
                className="form-control"
                value={udisInicio}
                onChange={(e) => setUdisInicio(Number(e.target.value))}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="udisEnd" className="form-label">
                UDIs a la fecha de fin
              </label>
              <input
                type="text"
                id="udisEnd"
                className="form-control"
                value={udisFin}
                onChange={(e) => setUdisFin(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Calcular
          </button>
        </div>
      </form>
      <Link
        target="_blank"
        href={
          "https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CF112&sector=18&locale=es"
        }
        className="mt-3"
      >
        Consultar UDIs Banco de México
      </Link>
      <Link href="/serie" target="_blank">
        Consultar datos cargados en esta App
      </Link>
      <div className="container">
        <h2>Resumen</h2>
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Monto - Suerte principal</h4>
                <p className="card-text fs-2">$ {monto.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Fecha de inicio</h4>
                <p className="card-text fs-2">{getDate(fechaInicio)}</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Fecha de fin</h4>
                <p className="card-text fs-2">{getDate(fechaFin)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">UDIs a la fecha de inicio</h4>
                <p className="card-text fs-2">{udisInicio}</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">UDIs a la fecha de fin</h4>
                <p className="card-text fs-2">{udisFin}</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Tiempo transcurrido</h4>
                <p className="card-text fs-2">
                  {Math.abs(
                    new Date(fechaFin).getTime() -
                      new Date(fechaInicio).getTime()
                  ) /
                    (1000 * 60 * 60 * 24)}{" "}
                  dias -{" "}
                  {calcularMesesTranscurridos(
                    new Date(fechaInicio),
                    new Date(fechaFin)
                  )}{" "}
                  meses
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-3">Calculo</h2>
        <div className="row mb-5">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Paso 1</h4>
                <p className="m-0">
                  Dividir el monto entre el valor de UDIs a la fecha de inicio
                </p>
                <p className="card-text fs-2 m-0">
                  $ {respuesta.paso1.toLocaleString()}
                </p>
                <small>Monto / UDIs Inicio</small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Paso 2</h4>
                <p className="m-0">
                  Multiplicar el resultado por el valor de UDIs a la fecha de
                  fin
                </p>
                <p className="card-text fs-2 m-0">
                  $ {respuesta.paso2.toLocaleString()}
                </p>
                <small>Paso 1 * UDIs Fin</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
