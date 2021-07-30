/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  Box
} from "@chakra-ui/react";

import Comment from './Comment';
import PostComment from './PostComment';

const CommentList = (props) => {
  // eslint-disable-next-line camelcase
  const { comments, post_id } = props;
  
  return (
    <Box 
      bg="gray.800" 
      mb="7vh" 
      w="60vw" 
      borderBottomRadius={10}
    >
      <Text 
        ml="10px" 
        fontSize="10px" 
        mb="1vh"
      >
        Comments
      </Text>
        {comments.map((comment) => <Comment key={comment.commentBody}comment={comment}/>)}
      {/* eslint-disable-next-line camelcase */}
      <PostComment post_id={post_id}/>
    </Box>
  );
};

CommentList.propTypes = {
  comments: PropTypes.isRequired,
  post_id: PropTypes.isRequired
};

export default CommentList;
