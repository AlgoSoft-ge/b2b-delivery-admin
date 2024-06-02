import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

interface ScannerPropsType {
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  setType: React.Dispatch<React.SetStateAction<"form" | "excel" | "barcode">>;
}

const Scanner: React.FC<ScannerPropsType> = ({ setBarcode, setType }) => {
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(
        null,
        videoRef.current,
        (result: Result | undefined) => {
          if (result) {
            setResult(result.getText());
          }
        }
      )
      .catch((err) => {
        console.error(err);
      });

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="viewport"
        style={{ width: "640px", height: "280px" }}
      />
      <div className="flex flex-col gap-6 mt-2">
        <p className="text-sm font-semibold text-gray-900 border-black border-2 p-1">
          ბარკოდი: {result || "დასკანერებული არ არის"}
        </p>
        {result && (
          <button
            className="rounded-full flex items-center justify-center gap-3 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            onClick={() => {
              setBarcode(result);
              setType("form");
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
