import React from 'react'

const HomePage = ({ votes, setVotes, error, user, setUser, showNotification }) => {
   
    const handleVote = async(voteId) => {
        try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/vote/${voteId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization : `Bearer ${localStorage.getItem("token")}`
            },
        }
        );
        if(!response.ok) {
            const resError = await response.json();
            throw new Error(resError.error);
        }
        const data = await response.json();
        setVotes((prev) => prev.map((v) => (v?._id === data?.vote?._id ? data?.vote : v))
        );
       setUser(data?.user);
    } catch(error){
        showNotification(error.message, "error");
    }
    };

  return (
    <div className='votes-page'>
        {error && <div className='error-message'>{error}</div>}
        <div className='votes-grid'>
            {votes?.map((vote, index) => (
                <div className='vote-card' key={index}>
                    <h3>{vote.option}</h3>
                    <p className='vote-count'>Votes: {vote.votes}</p>
                    <p className='createdBy'>Created By: {vote.createdBy?.email}</p>
                    <button className={`vote-btn ${!user || user?.votedfor ? "disabled":"" }`}
                    disabled={!user || user?.votedfor}
                    onClick={() => handleVote(vote?._id)}
                    >
                        {vote?._id === user?.votedfor ? "Voted":"Vote" }
                    </button>
                </div>
            ))}
        </div>
    </div>
  )
};

export default HomePage