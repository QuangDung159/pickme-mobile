import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const messageToSend = gql`
  mutation message ($data: InputMessage!){
    message(message: $data)
    {
      id
      to
      content
      createdAt
      updatedAt
    }
  }
`;

export default function ChatMessageTrigger({ toUserId, content, onSend }) {
    const [pushMessage] = useMutation(messageToSend);

    useEffect(() => {
        pushMessage({
            variables:
            {
                data: {
                    to: toUserId,
                    content,
                }
            }
        }).then((res) => {
            onSend(true, res);
        });
    }, []);

    return null;
}

ChatMessageTrigger.propTypes = {
    toUserId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onSend: PropTypes.func.isRequired
};
