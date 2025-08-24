import { useEffect, useState } from 'react';
import Modal from './components/Modal/Modal';
import UncontrolledForm from './components/Forms/UncontrolledForm';
import HookForm from './components/Forms/HookForm';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const { formData, modals, openModal, closeModal } = useStore();
  const [newItems, setNewItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewItems(new Set());
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData]);

  // const handleNewItem = (item: FormData) => {
  //   setNewItems((prev) => new Set(prev).add(item.id));
  // };

  return (
    <div className="app">
      <h1>React Forms</h1>

      <div className="buttons-container">
        <button onClick={() => openModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => openModal('hookForm')}>
          Open React Hook Form
        </button>
      </div>

      <div className="data-container">
        <h2>Submitted Data</h2>
        <div className="data-grid">
          {formData.map((item) => (
            <div
              key={item.id}
              className={`data-card ${newItems.has(item.id) ? 'new-item' : ''}`}
            >
              <h3>{item.name}</h3>
              <p>Age: {item.age}</p>
              <p>Email: {item.email}</p>
              <p>Gender: {item.gender}</p>
              <p>Country: {item.country}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt="Uploaded"
                  className="preview-image"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modals.uncontrolled}
        onClose={() => closeModal('uncontrolled')}
        title="Uncontrolled Form"
      >
        <UncontrolledForm />
      </Modal>

      <Modal
        isOpen={modals.hookForm}
        onClose={() => closeModal('hookForm')}
        title="React Hook Form"
      >
        <HookForm />
      </Modal>
    </div>
  );
}

export default App;
