import React, {useState, useEffect} from 'react';
import { db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  category: "",
  description: "",
};

const categoryOption = [
  "Abundance",
  "Money",
  "Desire",
  "Feeling",
];

const AddEditBlog = ({user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const {title, category, description} = form;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image upload to firebase successfully");
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    };

    file && uploadFile();
  }, [file]);

  useEffect(() => {
    id && getQuoteDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getQuoteDetail = async () => {
    const docRef = doc(db, 'quotes', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({...snapshot.data()});
    }
    setActive(null);
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const onCategoryChange = (e) => {
    setForm({...form, category: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && title && description) {
      if (!id) {
        try {
          await addDoc(collection(db, "quotes"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Quote created successfully");
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await updateDoc(doc(db, "quotes", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Quote updated successfully");
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      return toast.error("All fields are mandatory to fill");
    }

    navigate("/");
  };
  
  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12">
          <div className="text-center heading py-2">
              {id ? "Update Quote" : "Create Quote"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row blog-form" onSubmit={handleSubmit}>
              <div className="col-12 py-3">
              <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="Title"
                      name="title"
                      value={title}
                      onChange={handleChange}
                    />
              </div>
              
              <div className="col-12 py-3">
              
                <select
                 className='catg-dropdown'
                 value={category}
                 onChange={onCategoryChange}
                 >
                  <option> Select category</option>
                  {categoryOption.map((option, index) => (
                    <option value={option || ""} key={index}>{option}</option>
                  ))}
                 </select>
              </div>
                <div className="col-12 py-3">
                  <textarea 
                  className='form-control description-box'
                  placeholder='Description'
                  value={description}
                  name='description'
                  onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input 
                  type="file"
                   className="form-control"
                   onChange={(e) => setFile(e.target.files[0])}
                   />
                </div>
                <div className="col-12 py-3 text-center">
                  <button className="btn btn-add" type='submit'
                  disabled={progress !== null && progress < 100}
                  >
                    {id ? "Update" : "Submit"}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditBlog