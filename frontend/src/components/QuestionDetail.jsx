

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../style/QuestionDetail.css'

// const QuestionDetail = ({ questionId, onBackClick, onSubmitAnswer, isAnswerCorrect }) => {
//   const [question, setQuestion] = useState(null);
//   const [shuffledBlocks, setShuffledBlocks] = useState(null); // Store shuffled blocks
//   const [userAnswer, setUserAnswer] = useState('');
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [answerVerified, setAnswerVerified] = useState(null);

//   useEffect(() => {
//     if (questionId) {
//       const fetchQuestion = async () => {
//         try {
//           const response = await axios.get(`https://search-backend-i6u5.onrender.com/api/questions/${questionId}`);
//           setQuestion(response.data);

//           if (response.data.type === 'ANAGRAM') {
//             // Shuffle the blocks only once when the question is fetched
//             const shuffled = shuffleArray(response.data.blocks);
//             setShuffledBlocks(shuffled);
//           }
//         } catch (error) {
//           console.error('Error fetching question details:', error);
//         }
//       };
//       fetchQuestion();
//     } else {
//       console.log('No question ID provided');
//     }
//   }, [questionId]);

//   const handleAnswerSubmit = async () => {
//     try {
//       let response;
//       if (question.type === 'MCQ') {
//         if (!selectedOption || !selectedOption.text) {
//           console.error('No option selected');
//           return;
//         }

//         response = await axios.post('https://search-backend-i6u5.onrender.com/api/questions/verify-answer', {
//           questionId: question._id,
//           userAnswer: selectedOption.text,
//         });
//       } else if (question.type === 'ANAGRAM') {
//         response = await axios.post('https://search-backend-i6u5.onrender.com/api/questions/verify-answer', {
//           questionId: question._id,
//           userAnswer: userAnswer,
//         });
//       }

//       setAnswerVerified(response.data.isCorrect);
//       onSubmitAnswer(response.data.isCorrect); // Pass the result to the parent component
//     } catch (error) {
//       console.error('Error verifying answer:', error);
//     }
//   };

//   // Function to shuffle the blocks (letters or words)
//   const shuffleArray = (array) => {
//     let shuffledArray = [...array];
//     for (let i = shuffledArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//     }
//     return shuffledArray;
//   };

//   const renderBlocks = () => {
//     if (question?.type === 'ANAGRAM' && shuffledBlocks) {
//       return shuffledBlocks.map((block, index) => (
//         <span key={index} style={{ marginRight: '10px' }}>
//           {block.text}
//         </span>
//       ));
//     }
//     return null;
//   };

//   const renderMCQ = () => {
//     if (question?.type === 'MCQ') {
//       return question.options.map((option, index) => (
//         <div key={index}>
//           <input
//             type="radio"
//             name="mcqOption"
//             value={option.text}
//             onChange={() => setSelectedOption(option)}
//           />
//           <label>{option.text}</label>
//         </div>
//       ));
//     }
//     return null;
//   };

//   const renderReadAlong = () => {
//     if (question?.type === 'READ_ALONG') {
//       return (
//         <div>
//           <h3>{question.title}</h3>
//           {/* <p>{question.content || 'No content available for read along.'}</p> */}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className='container'>
//       {question ? (
//         <div>
//           <button onClick={onBackClick}>Back to List</button>
//           <h2>{question.title}</h2>
//           <div className='question-section'>
//             {question.type === 'MCQ' ? (
//               <p>Choose the correct answer:</p>
//             ) : question.type === 'ANAGRAM' ? (
//               <p>Rearrange the letters/words:</p>
//             ) : question.type === 'READ_ALONG' ? (
//               <p>Read along the text:</p>
//             ) : null}

//             {renderMCQ()}
//             {question.type === 'ANAGRAM' && (
//               <div className='block-container'>
//                 {renderBlocks()}
//                 <input
//                   type="text"
//                   value={userAnswer}
//                   onChange={(e) => setUserAnswer(e.target.value)}
//                   placeholder="Enter your answer"
//                 />
//               </div>
//             )}
//             {renderReadAlong()}

//             {/* Show submit button for MCQ and Anagram types only */}
//             {question.type !== 'READ_ALONG' && (
//               <button onClick={handleAnswerSubmit}>Submit Answer</button>
//             )}

//             {answerVerified !== null && (
//               <p>{answerVerified ? 'Correct Answer!' : 'Wrong Answer!'}</p>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default QuestionDetail;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack'; // Import useSnackbar from notistack
import '../style/QuestionDetail.css';

const QuestionDetail = ({ questionId, onBackClick, onSubmitAnswer, isAnswerCorrect }) => {
  const [question, setQuestion] = useState(null);
  const [shuffledBlocks, setShuffledBlocks] = useState(null); // Store shuffled blocks
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerVerified, setAnswerVerified] = useState(null);

  const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar hook

  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        try {
          const response = await axios.get(`https://search-backend-i6u5.onrender.com/api/questions/${questionId}`);
          setQuestion(response.data);

          if (response.data.type === 'ANAGRAM') {
            // Shuffle the blocks only once when the question is fetched
            const shuffled = shuffleArray(response.data.blocks);
            setShuffledBlocks(shuffled);
          }
        } catch (error) {
          console.error('Error fetching question details:', error);
        }
      };
      fetchQuestion();
    } else {
      console.log('No question ID provided');
    }
  }, [questionId]);

  const handleAnswerSubmit = async () => {
    try {
      let response;
      if (question.type === 'MCQ') {
        if (!selectedOption || !selectedOption.text) {
          console.error('No option selected');
          return;
        }

        response = await axios.post('https://search-backend-i6u5.onrender.com/api/questions/verify-answer', {
          questionId: question._id,
          userAnswer: selectedOption.text,
        });
      } else if (question.type === 'ANAGRAM') {
        response = await axios.post('https://search-backend-i6u5.onrender.com/api/questions/verify-answer', {
          questionId: question._id,
          userAnswer: userAnswer,
        });
      }

      setAnswerVerified(response.data.isCorrect);
      onSubmitAnswer(response.data.isCorrect); // Pass the result to the parent component

      // Show a success or error snackbar depending on the answer
      if (response.data.isCorrect) {
        enqueueSnackbar('Correct Answer!', { variant: 'success' }); // Success notification
      } else {
        enqueueSnackbar('Wrong Answer!', { variant: 'error' }); // Error notification
      }

    } catch (error) {
      console.error('Error verifying answer:', error);
    }
  };

  // Function to shuffle the blocks (letters or words)
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const renderBlocks = () => {
    if (question?.type === 'ANAGRAM' && shuffledBlocks) {
      return shuffledBlocks.map((block, index) => (
        <span key={index} style={{ marginRight: '10px' }}>
          {block.text}
        </span>
      ));
    }
    return null;
  };

  const renderMCQ = () => {
    if (question?.type === 'MCQ') {
      return question.options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            name="mcqOption"
            value={option.text}
            onChange={() => setSelectedOption(option)}
          />
          <label>{option.text}</label>
        </div>
      ));
    }
    return null;
  };

  const renderReadAlong = () => {
    if (question?.type === 'READ_ALONG') {
      return (
        <div>
          <h3>{question.title}</h3>
          {/* <p>{question.content || 'No content available for read along.'}</p> */}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='container'>
      {question ? (
        <div>
          <button onClick={onBackClick}>Back to List</button>
          <h2>{question.title}</h2>
          <div className='question-section'>
            {question.type === 'MCQ' ? (
              <p>Choose the correct answer:</p>
            ) : question.type === 'ANAGRAM' ? (
              <p>Rearrange the letters/words:</p>
            ) : question.type === 'READ_ALONG' ? (
              <p>Read along the text:</p>
            ) : null}

            {renderMCQ()}
            {question.type === 'ANAGRAM' && (
              <div className='block-container'>
                {renderBlocks()}
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                />
              </div>
            )}
            {renderReadAlong()}

            {/* Show submit button for MCQ and Anagram types only */}
            {question.type !== 'READ_ALONG' && (
              <button onClick={handleAnswerSubmit}>Submit Answer</button>
            )}

            {/* {answerVerified !== null && (
              <p>{answerVerified ? 'Correct Answer!' : 'Wrong Answer!'}</p>
            )} */}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuestionDetail;
