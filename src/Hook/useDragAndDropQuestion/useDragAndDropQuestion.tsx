import {
  ChangeEvent,
  DragEvent,
  Fragment,
  useEffect,
  useState,
} from "react";
import { QuestionType } from "../../Types/question.type";
import { question } from "../../constant/data";

import { motion } from "framer-motion";

interface UseDragAndDropReturn {
  questionData: QuestionType | null;
  answers: Record<number, string>;
  isSubmit: boolean;
  handleDragStart: (event: DragEvent<HTMLDivElement>, word: string) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, blankId: number) => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement>,
    blankId: number
  ) => void;
  handleSubmit: () => void;
  renderParagraphWithInputs: () => JSX.Element[];
}
const useDragAndDropQuestion = (): UseDragAndDropReturn => {
  const [questionData, setQuestionData] = useState<QuestionType | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  console.log("answers", answers);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  //function
  const handleDragStart = (event: DragEvent<HTMLDivElement>, word: string) => {
    event.dataTransfer?.setData("text/plain", word);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    blankId: number
  ) => {
    event.preventDefault();
    const dragWord = event.dataTransfer?.getData("text/plain");

    const correct = questionData?.blanks.find(
      (blank) => blank.id === blankId
    )?.correctAnswer;

    if (dragWord && dragWord === correct) {
      setAnswers((prev) => ({ ...prev, [blankId]: dragWord }));
    } else {
      return;
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    blankId: number
  ) => {
    const { value } = e.target;
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = () => {
    setIsSubmit(true);
  };

  const removeOuterWrapper = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body.firstElementChild;

    return body ? body.innerHTML : "";
  };

  const renderParagraphWithInputs = (): JSX.Element[] => {
    if (!questionData) return [];
    const parts = question.paragraph.match(
      /<[^>]*>[^<]*<\/[^>]*>|<[^>]+>|[^<]+/g
    );

    if (!parts) return [];

    let inputIndex = 0;

    return parts.flatMap((part, index) => {
    
      if (part.includes("[_input]")) {
        const segments = part.split("[_input]"); 
  
     
        return segments.map((segment, segmentIndex) => {
          const blank = questionData.blanks[inputIndex];
          const isLastSegment = segmentIndex === segments.length - 1;
  
      
          if (!isLastSegment && blank) {
            inputIndex++; 
          }
  
          return (
            <Fragment key={`${index}-${segmentIndex}`}>
            
              <span dangerouslySetInnerHTML={{ __html: segment }} />
              {!isLastSegment && blank && (
                blank.type === "input" ? (
                  <motion.input
                    key={`input-${inputIndex}`}
                    type="text"
                    onChange={(e) => handleInputChange(e, blank.id)}
                    value={answers[blank.id] || ""}
                    disabled={isSubmit && answers[blank.id] === blank.correctAnswer}
                    className="text-input"
                    whileFocus={{ scale: 1.1 }}
                  />
                ) : (
                  <motion.div
                    key={`drag-${inputIndex}`}
                    onDrop={(event) => handleDrop(event, blank.id)}
                    onDragOver={(e) => e.preventDefault()}
                    className="blank"
                    style={{
                      borderColor: answers[blank.id] === blank.correctAnswer ? "green" : "black",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {answers[blank.id] || "_"}
                  </motion.div>
                )
              )}
            </Fragment>
          );
        });
      }
  
      // Trả về phần không chứa `[ _input ]` như cũ
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  //useEffect
  useEffect(() => {
    if (question) {
      setQuestionData(question);
    }
  }, []);

  return {
    questionData,
    answers,
    isSubmit,
    renderParagraphWithInputs,
    handleDragStart,
    handleDrop,
    handleInputChange,
    handleSubmit,
  };
};

export default useDragAndDropQuestion;
