import { useState } from "react";
import styles from "./QandA.module.css";

const QandA = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/qa/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      setAnswer("Sorry, there was an error processing your question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.qaContainer}>
      <h2>Asset Analytics Q&A</h2>
      <div className={styles.questionSection}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your assets..."
          className={styles.questionInput}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className={styles.askButton}
        >
          {loading ? "Analyzing..." : "Ask"}
        </button>
      </div>
      {answer && (
        <div className={styles.answerSection}>
          <h3>Analysis:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default QandA;
