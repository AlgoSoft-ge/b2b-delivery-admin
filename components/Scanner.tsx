import React, { useEffect, useState } from "react";
import Quagga from "@ericblade/quagga2";

// Define the props type

interface Result {
  codeResult: {
    code: string;
  };
}

interface ScannerPropsType {
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  setType: React.Dispatch<React.SetStateAction<"form" | "excel" | "barcode">>;
}

const Scanner: React.FC<ScannerPropsType> = ({ setBarcode, setType }) => {
  const [results, setResults] = useState<Result[]>([]);

  const onDetected = (result: QuaggaJS.ResultObject) => {
    setResults([result as Result]);
  };

  const _onDetected = (result: QuaggaJS.ResultObject) => {
    onDetected(result);
  };

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 280,
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ["code_128_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(_onDetected);

    return () => {
      Quagga.stop();
      Quagga.offDetected(_onDetected);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div id="interactive" className="viewport" />
      <div className="flex flex-col gap-6 mt-2">
        <p className="text-sm font-semibold text-gray-900 border-black border-2 p-1">
          ბარკოდი:{" "}
          {results[0] ? results[0].codeResult.code : "დასკანერებული არ არის"}
        </p>
        {results[0] && (
          <button
            className={
              "rounded-full flex items-center justify-center gap-3 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            }
            onClick={() => {
              setBarcode(results[0].codeResult.code), setType("form");
            }}
          >
            შეკვეთის დამატება
          </button>
        )}
      </div>
    </div>
  );
};

export default Scanner;
