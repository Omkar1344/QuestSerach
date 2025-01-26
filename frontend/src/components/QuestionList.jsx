import '../style/QuestionList.css';

const QuestionList = ({ questions = [], onQuestionClick }) => {
    if (questions.length === 0) {
        return (
            <div className="question-list-wrapper">
              <p>No questions found matching your query.</p>
            </div>
          );
    }
  
    return (
      <div className='question-list-wrapper'>
        {questions.map((question) => (
          <div key={question._id} onClick={() => onQuestionClick(question)} className='question-item'>
            <h3>{question.title}</h3>
            <p>Type: {question.type}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default QuestionList;
  
