import { Container, VStack, Text, Input, Button, Box, Spinner, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const fetchEmails = async (setEmails, setLoading, setError, setFilteredEmails, authToken) => {
  setLoading(true);
  setError(false);
  try {
    const response = await fetch('https://api.emailservice.com/inbox', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch emails');
    const data = await response.json();
    setEmails(data);
    setFilteredEmails(data);
  } catch (error) {
    setError(true);
    console.error('Error fetching emails:', error);
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
  const [authToken, setAuthToken] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Placeholder for authentication logic
    const token = 'your-oauth-token-here'; // This should be dynamically obtained
    setAuthToken(token);
    fetchEmails(setEmails, setLoading, setError, setFilteredEmails, token);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = emails.filter(email => email.sender.toLowerCase().includes(value) || email.subject.toLowerCase().includes(value));
    setFilteredEmails(filtered);
  };

  const handleRefresh = () => {
    fetchEmails(setEmails, setLoading, setError, setFilteredEmails, authToken);
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