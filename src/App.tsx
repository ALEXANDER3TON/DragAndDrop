
import "./App.css";
import { DragEvent } from "react";

import useDragAndDropQuestion from "./Hook/useDragAndDropQuestion";
import { motion } from "framer-motion";

function App() {
  const {
    answers,
    handleDragStart,
    handleDrop,
    handleInputChange,
    handleSubmit,
    isSubmit,
    questionData,
    renderParagraphWithInputs,
  } = useDragAndDropQuestion();

  return (
    <div>
      {questionData ? (
        <div>
          <div className="paragraph">{renderParagraphWithInputs()}</div>

          <div className="drag-words">
            {questionData.dragWords.map((word) => (
              <motion.div
                key={word.id}
                className={`drag-word ${word.color}`}
                draggable
                onDragStart={(event) => {
                  console.log("event", event);
                  handleDragStart(
                    event as unknown as DragEvent<HTMLDivElement>,
                    word.word
                  );
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {word.word}
              </motion.div>
            ))}
          </div>

          <button onClick={handleSubmit} className="submit-btn">
            Submit
          </button>

          {isSubmit && (
            <div className="result">
              {Object.keys(answers).length === questionData.blanks.length &&
              Object.entries(answers).every(
                ([id, answer]) =>
                  questionData.blanks.find((blank) => blank.id === Number(id))
                    ?.correctAnswer === answer
              ) ? (
                <span className="correct">Correct!</span>
              ) : (
                <span className="incorrect">Try Again!</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
