import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

const mockSessions = [
  {
    _id: '1',
    role: 'Frontend Developer',
    score: 85,
    summary: 'Great performance! You showed strong understanding of React concepts.',
    questions: [
      {
        question: 'What is the difference between props and state in React?',
        answer: 'Props are passed from parent components while state is managed internally.',
        feedback: 'Good explanation!'
      },
      {
        question: 'Explain closure in JavaScript.',
        answer: 'A closure allows a function to access variables from its outer scope.',
        feedback: 'Nice understanding of lexical scope.'
      }
    ]
  }
]


const Transcript = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const session = mockSessions.find(
    (item) => item._id === id
  )


  if (!session) {
    return <h2>Transcript not found</h2>
  }


  return (
    <div className="transcript-page">

      <Card className="results-card">

        <h1>
          {session.role} Transcript
        </h1>

        <h2>
          Score: {session.score}/100
        </h2>


        {session.questions.map((item,index)=>(
          <Card 
            key={index}
            className="transcript-item"
          >

            <h3>
              Q{index+1}. {item.question}
            </h3>


            <p>
              <strong>Your Answer:</strong>
              <br/>
              {item.answer}
            </p>


            <p>
              <strong>Feedback:</strong>
              <br/>
              {item.feedback}
            </p>

          </Card>
        ))}


        <Button
          variant="outline"
          onClick={()=>navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>


      </Card>

    </div>
  )
}

export default Transcript