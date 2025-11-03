import { useState, useEffect } from "react";
import api from "../services/api";

interface Contact {
  id: number;
  name: string;
  number: string;
  email: string;
}

interface UseContactsProps {
  searchParam?: string;
  pageNumber?: number;
}

const useContacts = (props: UseContactsProps = {}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/contacts", {
          params: {
            searchParam: props.searchParam || "",
            pageNumber: props.pageNumber || 1,
          },
        });
        setContacts(data.contacts);
        setCount(data.count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [props.searchParam, props.pageNumber]);

  return { contacts, count, loading };
};

export default useContacts;
