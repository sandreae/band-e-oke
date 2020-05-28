import axios from 'axios'

export default function uploadOverdub(file, nudge) {
  let fileName = new Date()
  let fileType = 'webm'
  // dispatch is uploading
  axios.post('http://localhost:3001/sign_s3',{
    fileName : fileName,
    fileType : fileType
  })
    .then(response => {
      var returnData = response.data.data.returnData
      var signedRequest = returnData.signedRequest
      var url = returnData.url
      // dispatch set overdub url
      var options = {
        headers: {
          'Content-Type': fileType
        }
      }
      axios.put(signedRequest,file,options)
        .then(result => {
          // dispatch upload success => this.setState({success: true})
          const postData = async () => {
            try {
              const response = await axios.post('http://localhost:3001/overdubs', {
                url: url,
                nudge: nudge,
              })
              // dispatch uploading = false => this.props.setIsUploading(false)
              // this.props.onUploadComplete()
            } catch (error) {
              // dispatch uploading = false => this.props.setIsUploading(false)
            }
          }
          postData()
        })
        .catch(error => {
          alert('ERROR ' + JSON.stringify(error))
        })
    })
    .catch(error => {
      alert(JSON.stringify(error))
    })
}
