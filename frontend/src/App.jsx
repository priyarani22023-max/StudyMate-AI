import { useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  // =========================
  // AI Tutor
  // =========================
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Notes Summarizer
  // =========================
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // =========================
  // Quiz Generator
  // =========================
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);

  // =========================
  // Statistics
  // =========================
  const [stats, setStats] = useState({
    questions: Number(localStorage.getItem("studyQuestions")) || 0,
    summaries: Number(localStorage.getItem("studySummaries")) || 0,
    quizzes: Number(localStorage.getItem("studyQuizzes")) || 0,
  });

  // =========================
  // Smooth Navigation
  // =========================
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =========================
  // AI Tutor
  // =========================
  const askAI = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message,
        }
      );

      setReply(response.data.reply);

      setStats((prev) => {
        const newCount = prev.questions + 1;

        localStorage.setItem("studyQuestions", newCount);

        return {
          ...prev,
          questions: newCount,
        };
      });
    } catch (error) {
      console.error(error);
      setReply("Sorry, AI is not responding. Please try again.");
    }

    setLoading(false);
  };

  // =========================
  // Notes Summarizer
  // =========================
  const summarizeNotes = async () => {
    if (!notes.trim()) return;

    setSummaryLoading(true);
    setSummary("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/summarize",
        {
          notes,
        }
      );

      setSummary(response.data.summary);

      setStats((prev) => {
        const newCount = prev.summaries + 1;

        localStorage.setItem("studySummaries", newCount);

        return {
          ...prev,
          summaries: newCount,
        };
      });
    } catch (error) {
      console.error(error);
      setSummary("Sorry, summary could not be generated.");
    }

    setSummaryLoading(false);
  };

  // =========================
  // Quiz Generator
  // =========================
  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setQuizLoading(true);
    setQuiz("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quiz",
        {
          topic,
        }
      );

      setQuiz(response.data.quiz);

      setStats((prev) => {
        const newCount = prev.quizzes + 1;

        localStorage.setItem("studyQuizzes", newCount);

        return {
          ...prev,
          quizzes: newCount,
        };
      });
    } catch (error) {
      console.error(error);
      setQuiz("Sorry, quiz could not be generated.");
    }

    setQuizLoading(false);
  };

  return (
    <div className="app" id="home">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="navbar">

        <div
          className="logo"
          onClick={() => scrollToSection("home")}
          title="StudyMate AI"
        >
          <img
            src={logo}
            alt="StudyMate AI Logo"
          />
        </div>

        <div className="nav-links">

          <button onClick={() => scrollToSection("home")}>
            Home
          </button>

          <button onClick={() => scrollToSection("ai-tutor")}>
            AI Tutor
          </button>

          <button onClick={() => scrollToSection("quiz")}>
            Quiz
          </button>

          <button onClick={() => scrollToSection("notes")}>
            Notes
          </button>

        </div>

      </nav>

      {/* =========================
          STATS
      ========================= */}
      <section className="stats-section">

        <div className="stat-card">
          <div className="stat-icon">🤖</div>

          <div>
            <h3>{stats.questions}</h3>
            <p>Questions Asked</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>

          <div>
            <h3>{stats.summaries}</h3>
            <p>Notes Summarized</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❓</div>

          <div>
            <h3>{stats.quizzes}</h3>
            <p>Quizzes Created</p>
          </div>
        </div>

      </section>

      {/* =========================
          HERO
      ========================= */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-Powered Study Companion
          </div>

          <h1>
            Study Smarter.
            <br />
            <span>Learn Better.</span>
          </h1>

          <p className="subtitle">
            Your personal AI study companion for understanding
            difficult topics, summarizing notes, and practicing
            with AI-generated quizzes.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => scrollToSection("ai-tutor")}
            >
              Start Learning →
            </button>

            <button
              className="secondary-btn"
              onClick={() => scrollToSection("quiz")}
            >
              Try a Quiz
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          AI TUTOR
      ========================= */}
      <section
        className="feature-section"
        id="ai-tutor"
      >

        <div className="section-heading">

          <span>01</span>

          <div>
            <h2>🤖 AI Tutor</h2>

            <p>
              Ask questions and get simple explanations
              from your AI study companion.
            </p>
          </div>

        </div>

        <div className="feature-card">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something like: What is machine learning?"
            rows="5"
          />

          <button
            className="feature-btn"
            onClick={askAI}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask StudyMate ✨"}
          </button>

          {reply && (
            <div className="answer">

              <div className="answer-title">
                🤖 StudyMate Answer
              </div>

              <p>{reply}</p>

            </div>
          )}

        </div>

      </section>

      {/* =========================
          NOTES
      ========================= */}
      <section
        className="feature-section"
        id="notes"
      >

        <div className="section-heading">

          <span>02</span>

          <div>
            <h2>📝 Notes Summarizer</h2>

            <p>
              Turn lengthy notes into simple summaries,
              important points, and key terms.
            </p>
          </div>

        </div>

        <div className="feature-card">

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your study notes here..."
            rows="8"
          />

          <button
            className="feature-btn"
            onClick={summarizeNotes}
            disabled={summaryLoading}
          >
            {summaryLoading
              ? "Summarizing..."
              : "Summarize Notes ✨"}
          </button>

          {summary && (
            <div className="answer">

              <div className="answer-title">
                📚 Your Summary
              </div>

              <p>{summary}</p>

            </div>
          )}

        </div>

      </section>

      {/* =========================
          QUIZ
      ========================= */}
      <section
        className="feature-section"
        id="quiz"
      >

        <div className="section-heading">

          <span>03</span>

          <div>
            <h2>❓ Quiz Generator</h2>

            <p>
              Enter any study topic and generate
              AI-powered practice questions.
            </p>
          </div>

        </div>

        <div className="feature-card">

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic, e.g. Operating System"
            className="topic-input"
          />

          <button
            className="feature-btn"
            onClick={generateQuiz}
            disabled={quizLoading}
          >
            {quizLoading
              ? "Generating Quiz..."
              : "Generate Quiz ✨"}
          </button>

          {quiz && (
            <div className="answer">

              <div className="answer-title">
                🧠 Practice Quiz
              </div>

              <p>{quiz}</p>

            </div>
          )}

        </div>

      </section>

      {/* =========================
          WHY STUDYMATE
      ========================= */}
      <section className="why-section">

        <div className="why-content">

          <div className="hero-badge">
            💡 Why StudyMate?
          </div>

          <h2>
            Everything you need to
            <span> study smarter.</span>
          </h2>

          <p>
            StudyMate combines AI tutoring, note summarization,
            and quiz generation in one simple learning space.
          </p>

          <div className="benefits">

            <div>
              <strong>⚡ Fast Learning</strong>
              <span>Understand topics quickly.</span>
            </div>

            <div>
              <strong>🧠 Active Practice</strong>
              <span>Generate quizzes for revision.</span>
            </div>

            <div>
              <strong>📚 Simple Notes</strong>
              <span>Convert long notes into summaries.</span>
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer>

        <div className="footer-logo">
          📚 StudyMate AI
        </div>

        <p>
          Built with React, Node.js, Express, Ollama & Gemma
        </p>

        <p className="footer-small">
          StudyMate AI © 2026 | Open-weight AI powered learning
        </p>

      </footer>

    </div>
  );
}

export default App;