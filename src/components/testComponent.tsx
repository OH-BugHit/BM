import { Button } from '@knicos/genai-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function ButtonTest() {
    const [count, setCount] = useState(0);
    const { t } = useTranslation();

    const handleSetCount = () => {
        setCount(count + 1);
        console.log(count);
    };

    return (
        <Button
            onClick={() => handleSetCount()}
            size="large"
            variant="contained"
        >
            {t('test.button')}
        </Button>
    );
}

export default ButtonTest;
