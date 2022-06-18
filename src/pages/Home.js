import { collection, deleteDoc, doc, onSnapshot, } from 'firebase/firestore';
import React, {useState, useEffect} from 'react';
import { db } from '../firebase';
import QuoteSection from '../components/QuoteSection';
import  Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const Home = ({setActive, user}) => {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  
  useEffect(() => {
    
    const unsub = onSnapshot(
      collection(db, 'quotes'),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()})
        });
        setQuotes(list);
        setLoading(false);
        setActive('home');
      }, (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    }
  
  }, [setActive]);

  if (loading) {
    return <Spinner />
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, 'quotes', id));
        toast.success('Quote deleted');
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-1">
          <div className="col-md-11">
            <QuoteSection quotes={quotes} user={user} handleDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home