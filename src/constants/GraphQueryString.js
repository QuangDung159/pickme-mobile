export default {
    GET_LIST_MESSAGE: `query messages($to: String, $pageIndex: Int, $pageSize: Int){
        messages(to: $to, pageIndex: $pageIndex, pageSize: $pageSize) {
            id
            from
            to
            content
            isRead
            createdAt
            updatedAt
            }
        }`,

    GET_LIST_CONVERSATION: `query getRecently($pageIndex: Int, $pageSize: Int) {
        getRecently(pageIndex: $pageIndex, pageSize: $pageSize) {
            id
            from
            to
            content
            createdAt
            isRead
            fromUser {
                userId
                url
                fullName
                userName
                updatedAt
            }
            toUser {
                userId
                url
                fullName
                userName
                updatedAt
            }
            }
        }`,

    UPDATE_LAST_ACTIVE: `mutation updateLastActive($url: String){
        updateLastActive(url: $url) {
          userId
          url
          userName
          fullName
          createdAt
          updatedAt
        }
      }`,

    READ_ALL_MESSAGE: `mutation readAllMessage($from: String){ #url is the update for the image
        readAllMessage(from: $from)
      }`
};
