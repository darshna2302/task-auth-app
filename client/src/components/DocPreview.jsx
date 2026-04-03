import React, { useContext, useEffect, useRef } from "react";
import * as docx from "docx-preview";
import { AppContent } from "../context/AppContext";

const DocPreview = ({ fileUrl }) => {
  const containerRef = useRef();
  const {backendUrl}= useContext(AppContent)

  useEffect(() => {
    const loadDoc = async () => {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      await docx.renderAsync(blob, containerRef.current);
    };

    loadDoc();
  }, [fileUrl]);

  return (
    <div className="h-24 w-24 overflow-hidden bg-white rounded shadow">
      <div
        ref={containerRef}
        style={{
          transform: "scale(0.15)",
          transformOrigin: "top left",
          width: "800px"
        }}
      />
    </div>
    
  );
};

export default DocPreview;