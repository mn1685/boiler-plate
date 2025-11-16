import { Box, VStack, Heading, Text, Badge, HStack, Button } from '@chakra-ui/react';
import { useState } from 'react';

const ShotRecommendation = () => {
    const [recommendation, setRecommendation] = useState(null);

    const getRecommendation = () => {
        // Mock recommendation based on strokes gained data
        setRecommendation({
            club: 'Driver',
            strategy: 'Aim 10 yards left of center',
            confidence: 85,
            strokesGained: '+0.42',
            reasoning: 'Based on PGA Tour data, this shot yields highest expected value'
        });
    };

    return (
        <Box maxW="600px" mx="auto" p={6}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Shot Recommendation</Heading>

                <Button colorScheme="blue" onClick={getRecommendation}>
                    Get AI Recommendation
                </Button>

                {recommendation && (
                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        bg="white"
                        boxShadow="md"
                    >
                        <VStack align="stretch" spacing={4}>
                            <HStack justify="space-between">
                                <Heading size="md">Recommended Club</Heading>
                                <Badge colorScheme="green" fontSize="lg">
                                    {recommendation.club}
                                </Badge>
                            </HStack>

                            <Box>
                                <Text fontWeight="bold" mb={2}>Strategy:</Text>
                                <Text>{recommendation.strategy}</Text>
                            </Box>

                            <HStack justify="space-between">
                                <Box>
                                    <Text fontSize="sm" color="gray.600">Confidence</Text>
                                    <Text fontSize="xl" fontWeight="bold">
                                        {recommendation.confidence}%
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="sm" color="gray.600">Strokes Gained</Text>
                                    <Text fontSize="xl" fontWeight="bold" color="green.500">
                                        {recommendation.strokesGained}
                                    </Text>
                                </Box>
                            </HStack>

                            <Box bg="blue.50" p={3} borderRadius="md">
                                <Text fontSize="sm" fontStyle="italic">
                                    {recommendation.reasoning}
                                </Text>
                            </Box>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default ShotRecommendation;
