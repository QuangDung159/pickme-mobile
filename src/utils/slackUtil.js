import axios from 'axios';

export default (label, content) => {
    axios.post(
        'https://hooks.slack.com/services/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',
        {
            text: `${label}: ${content}`
        }
    );
};
