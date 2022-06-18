import { doc, getDoc } from 'firebase/firestore';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { db } from '../firebase';

const Detail = ({setActive}) => {
const {id} = useParams();
const [quote, setQuote] = useState(null);



  useEffect(() => {
    id && getQuoteDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const getQuoteDetail = async () => {
    const docRef = doc(db, 'quotes', id);
    const quoteDetail = await getDoc(docRef);
    setQuote(quoteDetail.data());
    setActive(null);
  };
  return (
    <div className="single">
      <div className="blog-title-box" style={{backgroundImage: `url(${quote?.imgUrl})`}}>
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{quote?.timestamp.toDate().toDateString()}</span>
          <h2>{quote?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col md-8">
              <span className="meta-info text-start">
                By <p className='author'>{quote?.author}</p> -&nbsp;
                {quote?.timestamp.toDate().toDateString()}
              </span>
              <p className="text-start">{quote?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Detail