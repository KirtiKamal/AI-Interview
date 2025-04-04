import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ interviewQuestion, activeQuestionIndex }) {
    console.log('QuestionsSection props:', { interviewQuestion, activeQuestionIndex });
    
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        }
        else {
            alert('Sorry, Your browser does not support text to speech')
        }
    }
    
    if (!interviewQuestion) {
        console.log('interviewQuestion is undefined');
        return <div>Loading questions...</div>;
    }
    
    if (!Array.isArray(interviewQuestion)) {
        console.log('interviewQuestion is not an array:', interviewQuestion);
        return <div>Invalid question format</div>;
    }
    
    if (interviewQuestion.length === 0) {
        console.log('No questions available');
        return <div>No questions available</div>;
    }
    
    const currentQuestion = interviewQuestion[activeQuestionIndex];
    console.log('Current question:', currentQuestion);
    
    if (!currentQuestion || !currentQuestion.question) {
        console.log('Current question is invalid:', currentQuestion);
        return <div>Invalid question format</div>;
    }
    
    return (
        <div className="p-5 rounded-lg border my-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {interviewQuestion.map((question, index) => (
                    <h2
                        key={index}
                        className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer
                            ${activeQuestionIndex === index ? "bg-primary text-white" : ""}
                        `}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>
            <div className="my-5">
                <h2 className="text-md md:text-lg font-semibold">Current Question:</h2>
                <p className="text-md md:text-lg mt-2">{currentQuestion.question}</p>
                <Volume2 
                    className="cursor-pointer mt-2" 
                    onClick={() => textToSpeech(currentQuestion.question)} 
                />
            </div>
            <div className="border rounded-lg p-5 items-center bg-green-100 mt-20">
                <h2 className="flex gap-2 items-center text-green-500">
                    <Lightbulb/>
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm text-primary my-2">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    );
}

export default QuestionsSection;