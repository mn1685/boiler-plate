import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    HStack,
    IconButton,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { API_URL } from './App';

const COMMON_CLUBS = [
    'Driver',
    '3-Wood',
    '5-Wood',
    '3-Hybrid',
    '4-Hybrid',
    '4-Iron',
    '5-Iron',
    '6-Iron',
    '7-Iron',
    '8-Iron',
    '9-Iron',
    'PW',
    'GW',
    'SW',
    'LW'
];

const GolfProfile = () => {
    const [handicap, setHandicap] = useState('');
    const [preferredHand, setPreferredHand] = useState('right');
    const [clubs, setClubs] = useState([]);
    const [newClub, setNewClub] = useState('Driver');
    const [newDistance, setNewDistance] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/golf/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setHandicap(data.handicap || '');
            setPreferredHand(data.preferredHand || 'right');
            setClubs(data.clubs || []);
        } catch (error) {
            toast({
                title: 'Error loading profile',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const addClub = () => {
        if (!newDistance) {
            toast({
                title: 'Please enter distance',
                status: 'warning',
                duration: 3000
            });
            return;
        }

        const existingClub = clubs.find((c) => c.club === newClub);
        if (existingClub) {
            toast({
                title: 'Club already added',
                status: 'warning',
                duration: 3000
            });
            return;
        }

        setClubs([...clubs, { club: newClub, avgDistance: parseInt(newDistance) }]);
        setNewDistance('');
    };

    const removeClub = (clubName) => {
        setClubs(clubs.filter((c) => c.club !== clubName));
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
            await fetch(`${API_URL}/api/golf/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    handicap: handicap ? parseInt(handicap) : null,
                    preferredHand,
                    clubs
                })
            });

            toast({
                title: 'Profile saved!',
                status: 'success',
                duration: 3000
            });
        } catch (error) {
            toast({
                title: 'Error saving profile',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box maxW="800px" mx="auto" p={6}>
                <Text>Loading profile...</Text>
            </Box>
        );
    }

    return (
        <Box maxW="800px" mx="auto" p={6}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg">Golf Profile</Heading>
                    <Text color="gray.600">Set up your clubs and distances for better recommendations</Text>
                </Box>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Handicap (optional)</FormLabel>
                            <Input
                                type="number"
                                value={handicap}
                                onChange={(e) => setHandicap(e.target.value)}
                                placeholder="18"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Preferred Hand</FormLabel>
                            <Select
                                value={preferredHand}
                                onChange={(e) => setPreferredHand(e.target.value)}
                            >
                                <option value="right">Right</option>
                                <option value="left">Left</option>
                            </Select>
                        </FormControl>
                    </VStack>
                </Box>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <VStack spacing={4} align="stretch">
                        <Heading size="md">Club Distances</Heading>

                        <HStack>
                            <FormControl>
                                <FormLabel>Club</FormLabel>
                                <Select value={newClub} onChange={(e) => setNewClub(e.target.value)}>
                                    {COMMON_CLUBS.map((club) => (
                                        <option key={club} value={club}>
                                            {club}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Avg Distance (yards)</FormLabel>
                                <Input
                                    type="number"
                                    value={newDistance}
                                    onChange={(e) => setNewDistance(e.target.value)}
                                    placeholder="150"
                                />
                            </FormControl>

                            <IconButton
                                icon={<AddIcon />}
                                colorScheme="blue"
                                onClick={addClub}
                                mt={8}
                                aria-label="Add club"
                            />
                        </HStack>

                        {clubs.length > 0 && (
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Club</Th>
                                        <Th isNumeric>Avg Distance (yards)</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {clubs.map((club) => (
                                        <Tr key={club.club}>
                                            <Td>{club.club}</Td>
                                            <Td isNumeric>{club.avgDistance}</Td>
                                            <Td>
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={() => removeClub(club.club)}
                                                    aria-label="Remove club"
                                                />
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </VStack>
                </Box>

                <Button colorScheme="blue" size="lg" onClick={saveProfile} isLoading={saving}>
                    Save Profile
                </Button>
            </VStack>
        </Box>
    );
};

export default GolfProfile;
