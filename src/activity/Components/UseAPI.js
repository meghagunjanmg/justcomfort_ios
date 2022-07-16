import { useState, useCallback } from 'react';

const UseAPI = (path, requestBodywithHeaders) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const makeRequest = useCallback(() => {
      setLoading(true);
      fetch('http://justcomfort.umbeo.com/admin/api/'+ path, requestBodywithHeaders)
        .then((res) => res.json())
        .then((data) => setData(res))
        .catch(() => {})
        .finally(() => setLoading(false));
  }, [path, setData, setLoading]);

  return [{ data, loading }, makeRequest];
};

export default UseAPI;