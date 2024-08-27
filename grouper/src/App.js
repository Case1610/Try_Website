import './App.css';
import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Container,
  Stack,
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Assignment as AssignmentIcon, Delete as DeleteIcon } from '@mui/icons-material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// CSVのコードブロックとコピーボタンコンポーネント
const CodeBlockWithCopyButton = ({ renderCSV }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [openTip, setOpenTip] = useState(false);

  // コピー機能を追加する関数
  const handleCopy = () => {
    const csvContent = renderCSV();
    navigator.clipboard.writeText(csvContent)
      .then(() => {
        setCopyStatus('Copied');
        setOpenTip(true);  // Tooltipを表示
      })
      .catch(err => {
        setCopyStatus('Error');
        setOpenTip(true);  // Tooltipを表示
      });
  };

  const handleCloseTip = () => {
    setOpenTip(false);  // Tooltipを閉じる
  };

  return (
    <Box sx={{ position: 'relative', display: 'block' }}>
      <pre>
        <code>{renderCSV()}</code>
      </pre>
      <InputAdornment position="end" sx={{ position: 'absolute', top:  20, right: 5 }}>
        <Tooltip
          arrow
          open={openTip}
          onClose={handleCloseTip}
          disableHoverListener
          placement='left'
          title={copyStatus === 'Copied' ? 'Copied!' : 'Error!'}
        >
          <IconButton onClick={handleCopy}>
            <AssignmentIcon />
          </IconButton>
        </Tooltip>
      </InputAdornment>
    </Box>
  );
};

const GroupingApp = () => {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  const [members, setMembers] = useState('');
  const [groupCount, setGroupCount] = useState(2);
  const [groupNames, setGroupNames] = useState('');
  const [groups, setGroups] = useState([]);

  // メンバー入力ハンドラ
  const handleMemberChange = (e) => setMembers(e.target.value);

  // グループ数変更ハンドラ
  const handleGroupCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count >= 2) {
      setGroupCount(count);
    }
  };

  // グループ名変更ハンドラ
  const handleGroupNamesChange = (e) => setGroupNames(e.target.value);

  // グループ分け処理
  const handleGroupMembers = () => {
    const memberList = members.split('\n').filter((name) => name.trim() !== '');
    const nameList = groupNames.split('\n').filter((name) => name.trim() !== '');
    const shuffledMembers = memberList.sort(() => Math.random() - 0.5);
    const groupSize = Math.ceil(shuffledMembers.length / groupCount);

    const newGroups = Array.from({ length: groupCount }, (_, i) => ({
      groupName: nameList[i] || `${i + 1}班`,
      members: shuffledMembers.slice(i * groupSize, (i + 1) * groupSize),
    }));

    setGroups(newGroups);
  };

  // クリア処理
  const handleClear = () => {
    setGroups([]);
    setMembers('');
    setGroupCount(2);
    setGroupNames('');
  };

  // CSVの表示処理
  const renderCSV = () => groups.map((group) => `${group.groupName},${group.members.join(',')}`).join('\n');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container fixed>
        <div>
          <h1>GROUPER</h1>

          {/* 新規作成ボタン */}
          <Button onClick={handleClear} variant="contained" margin="normal" size="medium">
            <b>新規作成</b>
          </Button>

          {/* メンバー入力テキストエリア */}
          <TextField
            label="メンバー入力："
            multiline
            rows={10}
            value={members}
            onChange={handleMemberChange}
            placeholder="1行に1名のメンバーを入力"
            fullWidth
            margin="normal"
          />

          {/* グループ数入力フィールド */}
          <TextField
            label="グループ数"
            type="number"
            value={groupCount}
            onChange={handleGroupCountChange}
            inputProps={{ min: 2 }}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* グループ名入力テキストエリア */}
          <TextField
            label="グループ名（任意）："
            multiline
            rows={3}
            value={groupNames}
            onChange={handleGroupNamesChange}
            placeholder="1行に1つのグループ名（任意）"
            fullWidth
            margin="normal"
          />

          {/* アクションボタン */}
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={3}>
            <Button onClick={handleGroupMembers} variant="contained" margin="normal" size="medium">
              <b>分ける</b>
            </Button>
            <Button onClick={handleClear} variant="outlined" startIcon={<DeleteIcon />} size="medium">
              クリア
            </Button>
          </Stack>

          {/* グループ結果表示 */}
          {groups.length > 0 && (
            <>
              <h2>出力結果</h2>
              <CodeBlockWithCopyButton renderCSV={renderCSV} />
              <div>{groups.map((group, index) => (
                <Box key={index} sx={{ margin: '10px', padding: '10px', border: '1px solid black' }}>
                  <h3>{group.groupName}</h3>
                  <ul>{group.members.map((member, i) => (
                    <li key={i}>{member}</li>
                  ))}</ul>
                </Box>
              ))}</div>
            </>
          )}
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default GroupingApp;
