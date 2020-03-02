import React, { useRef, useState } from 'react';
import Button from './Button';
import TextInput from './TextInput';
import useKeyDown from '../useKeyDown';

const TestClassifier = () => {
  const refInput = useRef<HTMLInputElement>(null);
  const [testValue, setTestValue] = useState('');
  const [testResult, setTestResult] = useState('');

  const onSubmit = async () => {
    if (testValue) {
      setTestResult('');
      //TODO: move endpoint
      const ENDPOINT = 'https://lv1yspajz6.execute-api.us-west-2.amazonaws.com/prod/classify';
      const url = `${ENDPOINT}?utterance=${encodeURIComponent(testValue)}`;
      console.log('url', url);
      const results = await fetch(url);
      const json = await results.json();
      console.log('JSON', json);
      if (json.success && json.data.result) {
        setTestResult(json.data.result);
      } else {
        setTestResult('An error occurred, please try again later.');
      }
    }
  };

  const onReset = () => {
    setTestValue('');
    setTestResult('');
    if (refInput.current) refInput.current.focus();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestValue(e.target.value);
  };

  useKeyDown(document.activeElement && document.activeElement.id === 'input-test', [13], onSubmit);

  return (
    <>
      <div className="my-4">
        <div className="flex items-center">
          <TextInput ref={refInput} id="input-test" className="mr-5" value={testValue} onChange={onChange} />
          <Button onClick={onSubmit}>Run Test</Button>
          <Button onClick={onReset}>Reset</Button>
        </div>
      </div>
      {testResult ? (
        <div className="px-6 pb-6">
          Classified as label: <span className="font-bold">{testResult}</span>
        </div>
      ) : null}
    </>
  );
};

export default TestClassifier;
