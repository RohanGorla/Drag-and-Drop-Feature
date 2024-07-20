import { useState, useRef, useEffect, createRef } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("data")) || []
  );
  const [text, setText] = useState("");
  const [current, setCurrent] = useState(-1);
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("black");
  const [fontFamily, setFontFamily] = useState("serif");
  const colors = ["red", "blue", "green", "brown", "black"];
  const fonts = [
    "Andale Mono, monospace",
    "serif",
    "Georgia, serif",
    "Gill Sans, sans-serif",
    "Helvetica, sans-serif",
    "Arial, sans-serif",
  ];

  console.log(fontSize, fontColor, fontFamily);

  useEffect(() => {
    function generatePosition() {
      const x_limit = window.innerWidth - 500;
      const y_limit = window.innerHeight - 250;
      return {
        x: Math.floor(Math.random() * x_limit),
        y: Math.floor(Math.random() * y_limit),
      };
    }

    const savedData = JSON.parse(localStorage.getItem("data")) || [];
    const updatedData = data.map((data) => {
      const saved = savedData.find((s_data) => s_data.id === data.id);
      if (saved) {
        return { ...data, position: saved.position };
      } else {
        const position = generatePosition();
        return { ...data, position };
      }
    });
    setData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  }, [data.length]);

  const dataRef = useRef([]);

  function mouseDown(e, card) {
    const currentCard = dataRef.current[card.id].current;
    let x_dist = 0,
      y_dist = 0;

    let x_start = e.clientX;
    let y_start = e.clientY;

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);

    function mousemove(e) {
      x_dist = e.clientX - x_start;
      y_dist = e.clientY - y_start;
      let cardLeft = currentCard.offsetLeft;
      let cardTop = currentCard.offsetTop;
      currentCard.style.left = `${cardLeft + x_dist}px`;
      currentCard.style.top = `${cardTop + y_dist}px`;
      x_start = e.clientX;
      y_start = e.clientY;

      const updatedData = data.map((data) => {
        if (data.id === card.id) {
          return {
            ...data,
            position: { x: cardLeft + x_dist, y: cardTop + y_dist },
          };
        } else {
          return data;
        }
      });

      setData(updatedData);
      localStorage.setItem("data", JSON.stringify(updatedData));
    }

    function mouseup() {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }
  }

  return (
    <>
      <div>
        {data.map((card) => {
          return (
            <p
              ref={
                dataRef.current[card.id]
                  ? dataRef.current[card.id]
                  : (dataRef.current[card.id] = createRef())
              }
              key={card.id}
              style={
                current === card.id
                  ? {
                      width: "250px",
                      position: "absolute",
                      top: `${card.position?.y}px`,
                      left: `${card.position?.x}px`,
                      backgroundColor: "orange",
                      color: card.color,
                      fontSize: `${card.font_size}px`,
                      fontFamily: `${card.font_family}`,
                      padding: "20px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      userSelect: "none",
                      cursor: "move",
                    }
                  : {
                      width: "250px",
                      position: "absolute",
                      top: `${card.position?.y}px`,
                      left: `${card.position?.x}px`,
                      backgroundColor: "white",
                      color: card.color,
                      fontSize: `${card.font_size}px`,
                      fontFamily: `${card.font_family}`,
                      padding: "20px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      userSelect: "none",
                      cursor: "move",
                    }
              }
              onMouseDown={(e) => {
                mouseDown(e, card);
              }}
              onClick={() => {
                setCurrent(card.id);
              }}
            >
              {card.text}
            </p>
          );
        })}
      </div>
      <div className="text-editor">
        <div className="add-text">
          <div className="text-input">
            <input
              type="text"
              placeholder="Enter text here..."
              onChange={(e) => {
                setText(e.target.value);
              }}
              value={text}
            ></input>
          </div>
          <div className="add-button">
            <button
              onClick={() => {
                setData((prev) => {
                  return [
                    ...prev,
                    {
                      id: data.length,
                      text: text,
                      font_size: fontSize,
                      font_family: fontFamily,
                      color: fontColor,
                    },
                  ];
                });
              }}
            >
              ADD
            </button>
          </div>
        </div>
        <div className="edit-text">
          <div className="font-size">
            <div>
              <label style={{ marginBottom: "10px" }}>Font Size</label>
            </div>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
              }}
            ></input>
          </div>
          <div className="font-color">
            <div>
              <label style={{ marginBottom: "10px" }}>Font Color</label>
            </div>
            <select
              value={fontColor}
              onChange={(e) => {
                setFontColor(e.target.value);
              }}
            >
              {colors.map((color, index) => {
                return (
                  <option key={index} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="font-family">
            <div>
              <label style={{ marginBottom: "10px" }}>Font Family</label>
            </div>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
              }}
            >
              {fonts.map((font, index) => {
                return (
                  <option key={index} value={font}>
                    {font}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="edit-button">
            <button
              onClick={() => {
                const updatedData = data.map((data) => {
                  if (data.id === current) {
                    return {
                      ...data,
                      font_size: fontSize,
                      font_family: fontFamily,
                      color: fontColor,
                    };
                  } else {
                    return data;
                  }
                });
                setData(updatedData);
                localStorage.setItem("data", JSON.stringify(updatedData));
                setCurrent(-1);
              }}
            >
              EDIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
