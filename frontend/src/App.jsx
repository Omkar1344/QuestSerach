
import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import QuestionList from './components/QuestionList';
import Pagination from './components/Pagination';
import QuestionDetail from './components/QuestionDetail';
import './App.css';


const App = () => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState(''); // Store the selected filter type (Anagram, MCQ, Read Along)
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  const fetchQuestions = async (searchQuery, page, filter) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://search-backend-i6u5.onrender.com/api/questions?query=${searchQuery}&page=${page}&limit=10&type=${filter}`
      );
      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    fetchQuestions(searchQuery, 1, filterType);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    fetchQuestions(query, 1, event.target.value); // Re-fetch questions based on the selected filter
  };

  const handlePageChange = (page) => {
    fetchQuestions(query, page, filterType);
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question); // Set selected question
    setIsAnswerCorrect(null); // Reset answer status
    setUserAnswer(''); // Reset user answer
  };

  const handleBackClick = () => {
    setSelectedQuestion(null); // Reset selected question to show the list
  };

  const handleAnswerSubmit = async () => {
    try {
      const response = await axios.post('https://search-backend-i6u5.onrender.com/api/questions/verify-answer', {
        questionId: selectedQuestion._id,
        userAnswer: userAnswer,
      });
      setIsAnswerCorrect(response.data.isCorrect);
    } catch (error) {
      console.error('Error verifying answer:', error);
    }
  };

  return (
    <div className='app-container'>
      <SearchBar onSearch={handleSearch} />

      {/* Only show filter if no question is selected */}
      {!selectedQuestion && (
        <div className='filter-dropdown-container'>
          <select onChange={handleFilterChange} value={filterType}>
            <option value="">All Types</option>
            <option value="ANAGRAM">Anagram</option>
            <option value="MCQ">MCQ</option>
            <option value="READ_ALONG">Read Along</option>
          </select>
        </div>
      )}

      {loading ? (
    <div className="loading-indicator">Loading...</div>
    ) : (
        <div>
          {selectedQuestion ? (
            <QuestionDetail
              questionId={selectedQuestion._id}
              onBackClick={handleBackClick}
              onSubmitAnswer={handleAnswerSubmit}
              isAnswerCorrect={isAnswerCorrect}
            />
          ) : (
            <div className='question-list-container'>
              <QuestionList
                questions={questions}
                onQuestionClick={handleQuestionClick}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
