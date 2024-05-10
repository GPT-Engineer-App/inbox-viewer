import { Container, VStack, Text, Input, Button, Box, Spinner, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const fetchEmails = async (setEmails, setLoading, setError, setFilteredEmails) => {
  setLoading(true);
  setError(false);
  try {
    // Simulated fetch request (replace with actual API call)
    const response = await new Promise((resolve) => setTimeout(() => resolve({
      data: [
        { id: 1, sender: "John Doe", subject: "Meeting Reminder", body: "Don't forget our meeting.", date: "2023-01-01" },
        { id: 2, sender: "Jane Smith", subject: "Project Update", body: "Here's the latest update on the project.", date: "2023-01-02" }
      ]
    }), 1000));
    setEmails(response.data);
    setFilteredEmails(response.data);
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};

const EmailList = ({ emails, onSelectEmail }) => (
  emails.map(email => (
    <Box key={email.id} p={4} shadow="md" borderWidth="1px" onClick={() => onSelectEmail(email)}>
      <Text fontWeight="bold">{email.sender}</Text>
      <Text>{email.subject}</Text>
      <Text isTruncated>{email.body}</Text>
    </Box>
  ))
);

const EmailDetails = ({ email, onClose }) => (
  <Box p={4} shadow="md" borderWidth="1px">
    <Text fontSize="xl" fontWeight="bold">{email.subject}</Text>
    <Text>{email.date}</Text>
    <Text>{email.sender}</Text>
    <Text>{email.body}</Text>
    <Button mt={4} onClick={onClose}>Close</Button>
  </Box>
);

const Index = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchEmails(setEmails, setLoading, setError, setFilteredEmails);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = emails.filter(email => email.sender.toLowerCase().includes(value) || email.subject.toLowerCase().includes(value));
    setFilteredEmails(filtered);
  };

  const handleRefresh = () => {
    fetchEmails(setEmails, setLoading, setError, setFilteredEmails);
    toast({
      title: "Inbox refreshed.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" p={4}>
      <Input placeholder="Search by sender or subject" onChange={handleSearch} mb={4} />
      <Button onClick={handleRefresh} mb={4}>Refresh Inbox</Button>
      {loading ? <Spinner /> : error ? <Text>Failed to load emails.</Text> : selectedEmail ? <EmailDetails email={selectedEmail} onClose={() => setSelectedEmail(null)} /> : <EmailList emails={filteredEmails} onSelectEmail={setSelectedEmail} />}
    </Container>
  );
};

export default Index;