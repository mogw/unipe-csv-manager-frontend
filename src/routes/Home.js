import { Link } from "react-router-dom"
import { useState } from "react"

function Home() {
  const [selectedFile, setFile] = useState(null)

  const fileInfo = () => {
    if (selectedFile) {
      return (
        <div>
          <h4>File Details:</h4>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      )
    } else {
      return (
        <div>
          <br />
          <h6>Choose before Pressing the Upload button</h6>
        </div>
      )
    }
  }

  const handleFileUpload = () => {
    if (!selectedFile) return alert("Please select file first")

    const formData = new FormData();

    formData.append("file", selectedFile);

    fetch(`${process.env.REACT_APP_API_ROOT}/csv/upload`, {
      method: "POST",
      body: formData
    }).then(res => res.json())
      .then(result => {
        alert(result.message)
      })
      .catch(err => {
        alert(err.message)
      })
  }

  return (
    <div className="home-page">
      <nav>
        Go to <Link to="/users">Users</Link>
      </nav>

      <h3>Upload csv file to import users</h3>

      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>
          Upload!
        </button>
      </div>
      {fileInfo()}
    </div>
  )
}

export default Home